---
layout: post
title: Keeping Magento satisfied behind Varnish
description: Things to look out for when running Varnish in front of your web server (Nginx).
lang: en
---

Working at [Karlsson &amp; Lord](http://karlssonlord.com) involves alot of new experiences and ways of solving technical problems for online retailers. This week I was fiddling around with a Magento module called [Turpentine](https://github.com/nexcess/magento-turpentine) that helps out when serving your front end via [Varnish](https://www.varnish-cache.org/).

## Internal Redirects

The one thing which struck me when configuring my local environment to use Varnish in front of [Nginx](http://nginx.org/) was that application redirects started acting wierd. Adding a product for comparision from a product view redirected me to the base URL, instead of back to the product view (referer). So I started digging into the core to see what actually going on.

### app/code/core/Mage/Core/Controller/Varien/Action.php:773

The `_getRefererUrl` method looks for any referer URL in the request URI or from request headers. For some reason the `$refererUrl` did not pass as `_isUrlInternal` which makes it fall back to the base URL.

    /**
     * Identify referer url via all accepted methods (HTTP_REFERER, regular or base64-encoded request param)
     *
     * @return string
     */
    protected function _getRefererUrl()
    {
        $refererUrl = $this->getRequest()->getServer('HTTP_REFERER');
        if ($url = $this->getRequest()->getParam(self::PARAM_NAME_REFERER_URL)) {
            $refererUrl = $url;
        }
        if ($url = $this->getRequest()->getParam(self::PARAM_NAME_BASE64_URL)) {
            $refererUrl = Mage::helper('core')->urlDecode($url);
        }
        if ($url = $this->getRequest()->getParam(self::PARAM_NAME_URL_ENCODED)) {
            $refererUrl = Mage::helper('core')->urlDecode($url);
        }

        $refererUrl = Mage::helper('core')->escapeUrl($refererUrl);

        if (!$this->_isUrlInternal($refererUrl)) {
            $refererUrl = Mage::app()->getStore()->getBaseUrl();
        }
        return $refererUrl;
    }

### app/code/core/Mage/Core/Controller/Varien/Action.php:799

Here Magento's looking for the position of the (base URL) string `"http://domain.com/"` in (the referer URL) `"http://domain.com:8080/any/url.html"`, which will never be found because of the port number Nginx was listening on (behind Varnish).

    /**
     * Check url to be used as internal
     *
     * @param   string $url
     * @return  bool
     */
    protected function _isUrlInternal($url)
    {
        if (strpos($url, 'http') !== false) {
            /**
             * Url must start from base secure or base unsecure url
             */
            if ((strpos($url, Mage::app()->getStore()->getBaseUrl()) === 0)
                || (strpos($url, Mage::app()->getStore()->getBaseUrl(Mage_Core_Model_Store::URL_TYPE_LINK, true)) === 0)
            ) {
                return true;
            }
        }
        return false;
    }

### app/code/core/Mage/Core/Helper/Url.php:37

That port number is (for some odd reason) added when building the current URL in Magento.

    /**
     * Retrieve current url
     *
     * @return string
     */
    public function getCurrentUrl()
    {
        $request = Mage::app()->getRequest();
        $port = $request->getServer('SERVER_PORT');
        if ($port) {
            $defaultPorts = array(
                Mage_Core_Controller_Request_Http::DEFAULT_HTTP_PORT,
                Mage_Core_Controller_Request_Http::DEFAULT_HTTPS_PORT
            );
            $port = (in_array($port, $defaultPorts)) ? '' : ':' . $port;
        }
        $url = $request->getScheme() . '://' . $request->getHttpHost() . $port . $request->getServer('REQUEST_URI');
        return $url;
    }

### Getting the redirects working again

Without altering the application, your webserver (Nginx) needs to be listening on port 80 (or 443) while still keeping Varnish in front of it. This can be accomplished by using [iptables](http://en.wikipedia.org/wiki/Iptables).