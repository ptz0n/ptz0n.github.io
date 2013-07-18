---
layout: post
title: Smashing Redis keys with bash
description: Matching Redis keys with regular expressions when glob patterns just ain't enough.
lang: en
---

When evolving a data model I often tend to change stuff, and sometimes even get rid of them all together to give me a fresh start. But [flushing](http://redis.io/commands/flushdb) a [Redis](http://redis.io/) database is not always a good idea if you want to keep some of your keys.

Instead we try to match all the keys with the same pattern as `user:123456` that we need to remove.

    $ redis-cli KEYS "user:*"
    1) "user:123:friends"
    2) "user:234"
    3) "user:345:favorites"
    4) "user:234"
    5) "user:345"

Sadly the [KEYS](http://redis.io/commands/keys) command in Redis only supports glob-style patterns which makes it hard to perfectly match the pattern we want. Additionally we will use `grep` to filter the results with a regular expression.

    $ redis-cli KEYS "user:*" | grep "user:[0-9]\+$"
    user:234
    user:234
    user:345

Now we are on to something, finally it's time to [delete](http://redis.io/commands/del) the matched keys using `xargs`.

    $ redis-cli KEYS user:* | grep 'user:[0-9]\+$' | xargs redis-cli DEL

## Caution is advised when using KEYS

The `KEYS` command is intended for debugging purposes and may ruin performance on large databases.

> Consider KEYS as a command that should only be used in production environments with extreme care.