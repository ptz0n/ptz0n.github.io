---
layout: post
title:  Hur Passbook håller dina biljetter &amp; kuponger
description: Passbook i iPhone eller iPod touch med iOS 6 ger användare möjlighet att lagra och hålla koll på biljetter &amp; kuponger.
image: passbook-icon.png
---

En del av nya iOS 6 är __Passbook__ som samlar dina biljetter, medlemskort, bonuscheckar och kuponger. Jag blev snabbt imponerad av hur enkelt det är att skapa och utfärda _pass_, såhär funkar det.

<img src="{{ site.url }}/images/passbook.png" alt="Passbook i iOS 6" class="center" />

## Skapa pass för Passbook

Sedan första betan av iOS 6 har det dykt upp ett gäng nya tjänster för kommunicera med Passbook. Men har du koll på iOS och HTTP(S) finns det ingen anledning att inte göra det själv på din server med:

1. Ett [Utvecklarkonto för iOS](https://developer.apple.com/programs/ios/)
2. ett [Pass Type ID](https://developer.apple.com/ios/manage/passtypeids/index.action) &amp; certifikat
3. ditt [WWDR Intermediate certificate](https://developer.apple.com/certificationauthority/AppleWWDRCA.cer).

Själva passet utformas enkelt med JSON och bildresurser. Innehållet signeras med certifikaten ovan, komprimeras (ZIP) och sparas med filändelsen `.pkpass`. Packar du upp en `.pkpass`-fil kan innehållet se ut såhär:

* `icon.png`
* `icon@2x.png`
* `logo.png`
* &#8230;
* `manifest.json`
* `pass.json`
* `signature`

## Distribuera pass till enheter

Via e-post eller serva dem direkt över HTTP(S) med headern `Content-type: application/vnd.apple.pkpass`. Passbook syncar pass via iCloud mellan enheter med samma konto.

Just nu finns Passbook bara för iPhone och iPod touch samt i Safari och Mail på Passbook Mountain Lion 10.8.2.

## Pusha uppdateringar till pass

Har du deklarerat nyklarna `webServiceURL` och `authenticationToken` i ditt pass meddelar Passbook din server om varje enhet som lägger till det. Då har du `pushToken` för given enhet och kan meddela Passbook när det finns uppdaterade pass att hämta.

Detta görs via Apple Push Notification Service (APNS), precis som andra push-notiser till appar i iOS.

Som [Joakim](https://twitter.com/kalasjocke) förtydligade; håller inte Passbook koll på om ett värdebevis är förbrukat. Point of Sale (POS) behöver själv hantera detta och meddela Passbook om uppdateringar.

### 1. Passbook registrerar ett pass

`POST {webServiceURL}/v1/passes/{passTypeIdentifier}/{serialNumber}`

Denna request gör varje enhet när ett pass läggs till av användare eller iCloud. I request body (JSON) finns `pushToken`.

### 2. Skickar en push-notis när uppdaterade pass finns tillgängliga

Detta meddelar Passbook (via APNS) att något pass utfärdat av dig (`passTypeIdentifier`) är uppdaterat. Du behöver inte definiera någon payload.

### 3. Nu vill Passbook veta vilka pass som är uppdaterade

`GET {webServiceURL}v1/devices/{deviceLibraryIdentifier}/registrations/{passTypeIdentifier}[?passesUpdatedSince=tag]`

Svara med tidsstämpel för senaste ändring av något pass för enheten samt en array med en eller flera `serialNumber` (pass).

### 4. Passbook hämtar uppdaterade pass

`GET {webServiceURL}v1/passes/{passTypeIdentifier}/{serialNumber}`

Utifrån arrayen returnerad i steg 3, hämtar Passbook en eller flera uppdaterade `.pkpass`-filer.

## Integrera med appar

Det fina med Passbook är att du som utvecklare inte behöver någon app för att skapa, distribuera eller uppdatera pass. Men genom att ange ett eller flera app-ID:n i dina pass ges åtkomst för att läsa och uppdatera dem. Detta kan vara intressant när användaren vill ladda sitt kaffekort eller välja plats på flyget.

<img src="{{ site.url }}/images/passbook-appar.png" alt="Integrera Passbook med appar" title="Passbook Sverige" class="center" />

## Passbook i Sverige

Ännu är det bara ett fåtal aktörer i Sverige som meddelat att de kommer implementera Passbook. Pinga mig om du hittar någon app eller tjänst som går att testa så återkommer jag med en utvärdering.

## Passbook i Mountain Lion 10.8.2

Från version 10.8.2 av OS X, lanserad 19 september, kan du granska och lägga till pass för att synca till Passbook via iCloud från Safari och Mail.

> This pass will be added to Passbook on your iPhone or iPod touch using iCloud.

## Gräv djupare i &amp; testa Passbook

* [Passbook for Developers](https://developer.apple.com/passbook/)
* [PHP-bibliotek för att skapa `.pkpass`-filer](https://github.com/tschoffelen/PHP-PKPass)
* [Exempel-implementation av Passbook web service i Rails](https://github.com/mattt/passbook_rails_example), tack [Anton](https://twitter.com/mptre)
* [Coding Passbook](https://www.billguard.com/blog/2012/10/coding-passbook-lessons-learned/)
* [PassSource (beta)](http://www.passsource.com/)

__Vill du erbjuda dina kunder eller användare information via Passbook? Tveka inte att kontakta mig, jag hjälper gärna till.__