---
layout: front
title: Erik Eng utvecklar för webb &amp; mobilt
---

Erik Eng, tidigare Pettersson, är en utvecklare tänker lite extra på slutanvändare. På dagarna förbättrar han e-handel genom öppen källkod.

Ibland finns det tid för roliga sidoprojekt som <a href="http://www.hittebo.se/" title="Hittebo">social bostadsförmedling</a> eller tillgängliggörande av <a href="http://tagtider.net/">Tågtider</a> för resenärer i Sverige.

<section class="posts">
    {% for post in site.posts %}
        <article>
            <h3><a href="{{ post.url }}">{{ post.title }}</a></h3>
            <time datetime="{{ page.date }}">{{ post.date | date_to_string }}</time>
        </article>
    {% endfor %}
</section>