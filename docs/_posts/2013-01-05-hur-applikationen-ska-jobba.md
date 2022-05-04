---
layout: post
title: Hur applikationen ska jobba
description: Oavsett om det gäller att posta en kommentar, lägga en order eller hämta en lista med dina vänner från Facebook ska användaren inte behöva vänta längre än nödvändigt för att bli nöjd.
---

Genom åren med applikationer som WordPress eller Magento har jag lärt mig att värna om svarstider. Låt oss bortse från cache för en stund och fokusera på transaktioner, processer eller jobb som ska köras för att användaren ska få det denne har efterfrågat.

Oavsett om det gäller att posta en kommentar, lägga en order eller hämta en lista med dina vänner från Facebook ska användaren inte behöva vänta längre än nödvändigt för att bli nöjd&#185;.

## Varför det tar sådan tid

Oftast har stora applikationer många beroenden. När en order skapas i Magento ska lager dekrementeras, offertobjektet konverteras till en order, e-postmeddelanden skickas etc. Jag tycker att det är få, om några alls, av dessa som ska låta kunden vänta för att få se sidan "Tack för din beställning".

## Köa &amp; utför jobb vid sidan av

Dyra (tunga/långsamma) processer (jobb) som inte behöver belasta request-response-loopen, och således användaren, ska inte heller göra det. Placera dessa jobb i kö vid sidan av för att utföras snarast möjligt istället för att användaren ska stirra på en webbläsare som står och tuggar.

Det finns många av verktyg för att hantera schemaläggning och arbetsmyror (älska uttrycket). Hittills har jag använt [Redis (pubsub)](http://redis.io/commands#pubsub) eller [RabbitMQ](http://www.rabbitmq.com) beroende på typen av jobb som ska köras.

&#185; Det är oftast viktigare att svara snabbt än fullständig.