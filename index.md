---
layout: front
title: Erik Eng utvecklar för webb &amp; mobilt
---

Erik Eng, tidigare Pettersson, är en utvecklare som tänker lite extra på slutanvändaren. Dagarna ägnas åt att förbättra e-handel med öppen källkod.

Ibland finns det tid för roliga sidoprojekt som <a href="http://www.hittebo.se/" title="Hittebo">social bostadsförmedling</a> eller tillgängliggörande av <a href="http://tagtider.net/">Tågtider</a> för resenärer i Sverige. Se inlägg nedan för tankar om teknik och trender inom webbutveckling.

<section class="posts">
    {% for post in site.posts %}
        <article>
            <time datetime="{{ page.date }}">{{ post.date | date_to_string }}</time>
            <h2><a href="{{ post.url }}">{{ post.title }}</a></h2>
        </article>
    {% endfor %}
</section>