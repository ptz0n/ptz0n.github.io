---
layout: post
title: Optimize your responsive images
description: Using smart tools to make images light without loosing (too much) details.
lang: en
image: corgi-100.jpg
---

__If you haven't already implemented a [responsive images solution](http://www.smashingmagazine.com/2013/07/08/choosing-a-responsive-image-solution/) for your sites that target mobile devices. Go ahead and do it, now.__

Scaling images and saving the different sizes is the first problem you should focus on solving. This will save you alot of bytes when serving them to small viewports. When you do have your responsive images in place, it's time to go the extra mile and optimize the compression.

## Keep originals at maximum quality

Remember to always save/upload the originals without any compression at all, eg. at 100 % quality. Otherwise you will loose quality when scaling them down later.

## Optimize compression for each size &amp; image

For this task I like to use [imgmin](https://github.com/rflynn/imgmin) to determine the optimal quality setting for any given image. Small file sizes _and_ minimal quality loss sure is a pleasure.

<figure class="center">
    <img src="{{ site.url }}/images/corgi-100.jpg" />
    <figcaption>Before: 100 % / 227 KB</figcaption>
</figure>

<figure class="center">
    <img src="{{ site.url }}/images/corgi-optimized.jpg" />
    <figcaption>After: 95 % / 92.8 KB</figcaption>
</figure>

<figure class="center">
    <img src="{{ site.url }}/images/corgi-75.jpg" />
    <figcaption>Photoshop: 75 % / 94.6 KB</figcaption>
</figure>