---
layout: post
title: Små skärmar med snabb uppkoppling
description:
---

När vi utvecklar för webb är det alltid viktigt att se över de resurser som läses in. Att de behövs, skickas med rätt headers, är komprimerade osv. Enligt [Net Index](http://www.netindex.com/) har vi i Europa världens bästa bandbredd och ser vi till enskilda länder ligger Sverige på plats 13.

Då enheter i Sverige generellt har väldigt goda anslutningar prioriteras sällan optimering i utvecklingsprojekt, d.v.s. små justeringar som ger användaren en bättre helhetsupplevelse.

Jag ser ofta bilder, video och andra tunga resurser läsas in utan hänsyn till viktiga egenskaper som skärmstorlek och anslutningshastighet. Apple har gjort ett fantastiskt jobb med [DSS](http://dss.macosforge.org/) för att dynamiskt anpassa kvaliteten på strömmande media beroende på bland annat dessa egenskaper. Ännu finns dock ingen [standard](http://www.w3.org/community/respimg/) eller något [alternativ](http://www.alistapart.com/articles/responsive-images-how-they-almost-worked-and-what-we-need/) som gör detta optimalt för webbresurser.

## Stora skärmar med långsam uppkoppling

En iPhone 4 kan vara uppkopplad via 5 Hz WiFi med 100 Mbit, varför då inte använda @2x-media för att tillgodose den höga skärmdensiteten? Samma problem, i andra änden av spektrat, uppstår när data via en 2- eller 3G-anslutning ska renderas på 27". Skärmstorleken har ingenting med anslutningen att göra, men det verkar få ta hänsyn till.

Mobilnät har en latens på ~50-1000 ms vilket enkelt ger laddtider på över 5 s. Detta är enligt Google på gränsen till då användare avbryter och går tillbaka för att välja en annan sökträff. Laddar din webb snabbare än konkurrenterna premieras den av användare (och Google), förutsatt att innehållet är relevant.

Tills dess att vi har pålitliga tekniker för att serva resurser av varierande storlek är det fortsatt viktigt att generellt optimera innehåll och begränsa antalet tunga resurser, oavsett vilken användare du riktar dig till.