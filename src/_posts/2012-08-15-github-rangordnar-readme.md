---
layout: post
title: Hur GitHub rangordnar README-filer
description: När du använder flera README-filer i repo-rooten eller undermappar på GitHub.
---

__TLDR;__ Alfabetisk.

Jag gillar [GitHub](https://github.com/), dels för smidig hosting av källkod men
också för kollaborering och spridning av idéer. För tydlig presentation och
dokumentation av projekt används README-filer. GitHub renderar dessa filer till HTML
från en [mängd olika format](https://github.com/github/markup/).

Av dessa föredrar jag [Markdown](http://daringfireball.net/projects/markdown/) (.md),
men tillägg i [WordPress-katalogen](http://wordpress.org/extend/) kräver en README med filändelsen txt. GitHub parsar
txt-filer som `plain/text` trots att de innehåller Markdown-syntax.

För att vara både GitHub och WordPress-katalogen till lags för presentation av mina
tillägg behöver jag två README-filer i samma katalog i repot, `README.md` och
`readme.txt`.

Som tur är prioriterar GitHub `.md` före `.txt`, dock saknas dokumentation om hur de
övriga formaten rangordnas. Därför gjorde jag lite
[tester](https://github.com/ptz0n/readme-test) som gav följande:

1. asciidoc
2. creole
3. md\|mkdn?\|mdwn\|mdown\|markdown
4. mediawiki\|wiki
5. org
6. pod
7. rdoc
8. re?st(\.txt)?
9. textile
10. txt
11. utan filändelse
