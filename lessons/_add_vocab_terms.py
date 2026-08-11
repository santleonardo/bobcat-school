# -*- coding: utf-8 -*-
"""
Mark selected difficult/unknown terms in lesson HTML with
<span class="vocab-word" data-word="...">...</span>
so students can tap for the same AI vocab card used in chat.

Criteria: grammatical terminology, multi-meaning words, less common
lexis, structures learners often struggle with — NOT every word.
"""
from pathlib import Path
import re

OUT = Path(__file__).resolve().parent

# Longer phrases first so they match before shorter tokens.
# (display_text_or_regex_group, data-word) — data-word is what goes to the API.
TERMS = [
    # Grammar / metalanguage (hard for A1–B1)
    (r'Present Continuous', 'Present Continuous'),
    (r'Present Perfect', 'Present Perfect'),
    (r'Simple Present', 'Simple Present'),
    (r'Simple Past', 'Simple Past'),
    (r'Past Continuous', 'Past Continuous'),
    (r'going to', 'going to'),
    (r'phrasal verbs?', 'phrasal verb'),
    (r'Phrasal verbs?', 'phrasal verb'),
    (r'modal verbs?', 'modal verb'),
    (r'Modal verbs?', 'modal verb'),
    (r'countable', 'countable'),
    (r'uncountable', 'uncountable'),
    (r'comparatives?', 'comparative'),
    (r'superlatives?', 'superlative'),
    (r'conditionals?', 'conditional'),
    (r'Zero Conditional', 'zero conditional'),
    (r'First Conditional', 'first conditional'),
    (r'object pronouns?', 'object pronoun'),
    (r'possessive pronouns?', 'possessive pronoun'),
    (r'possessive adjectives?', 'possessive adjective'),
    (r'auxiliary', 'auxiliary'),
    (r'infinitive', 'infinitive'),
    (r'past participle', 'past participle'),
    (r'irregular verbs?', 'irregular verb'),
    (r'regular verbs?', 'regular verb'),
    (r'prepositions?', 'preposition'),
    (r'quantifiers?', 'quantifier'),
    (r'There is / There are', 'There is / There are'),
    (r'There is', 'There is'),
    (r'There are', 'There are'),
    # Multi-meaning / tricky function words (only when standalone-ish)
    (r"doesn't", "doesn't"),
    (r"don't", "don't"),
    (r"can't", "can't"),
    (r"won't", "won't"),
    (r"isn't", "isn't"),
    (r"aren't", "aren't"),
    (r"wasn't", "wasn't"),
    (r"weren't", "weren't"),
    (r"haven't", "haven't"),
    (r"hasn't", "hasn't"),
    (r'already', 'already'),
    (r'yet', 'yet'),
    (r'just', 'just'),
    (r'since', 'since'),
    (r'until', 'until'),
    (r'although', 'although'),
    (r'however', 'however'),
    (r'because of', 'because of'),
    (r'in order to', 'in order to'),
    (r'as soon as', 'as soon as'),
    (r'used to', 'used to'),
    (r'have to', 'have to'),
    (r'ought to', 'ought to'),
    (r'should', 'should'),
    (r'must', 'must'),
    (r'might', 'might'),
    (r'could', 'could'),
    (r'would', 'would'),
    # Common hard lexical items in the curriculum
    (r'adventure', 'adventure'),
    (r'experience', 'experience'),
    (r'opportunity', 'opportunity'),
    (r'responsibility', 'responsibility'),
    (r'environment', 'environment'),
    (r'achievement', 'achievement'),
    (r'challenge', 'challenge'),
    (r'available', 'available'),
    (r'necessary', 'necessary'),
    (r'comfortable', 'comfortable'),
    (r'different', 'different'),
    (r'interesting', 'interesting'),
    (r'difficult', 'difficult'),
    (r'important', 'important'),
    (r'especially', 'especially'),
    (r'actually', 'actually'),
    (r'probably', 'probably'),
    (r'usually', 'usually'),
    (r'frequently', 'frequently'),
    (r'occasionally', 'occasionally'),
    (r'recently', 'recently'),
    (r'immediately', 'immediately'),
    (r'eventually', 'eventually'),
]

# Sections where we want clickable terms (ids or class-ish markers)
SECTION_HINTS = (
    'id="grammar"',
    'id="vocab"',
    'id="objetivos"',
    'id="review"',
    'id="cultura"',
    'id="warmup"',
    'class="struct-example"',
    'sec-title">📘',
    'Gramática',
)

SKIP_TAGS = re.compile(
    r'(<script\b[^>]*>.*?</script>)|(<style\b[^>]*>.*?</style>)|(<button\b[^>]*>.*?</button>)|(<a\b[^>]*>.*?</a>)',
    re.I | re.S
)

ALREADY = re.compile(r'class="vocab-word"', re.I)


def protect_blocks(html):
    """Replace script/style/button/a with placeholders."""
    blocks = []
    def repl(m):
        blocks.append(m.group(0))
        return f'___BLOCK{len(blocks)-1}___'
    return SKIP_TAGS.sub(repl, html), blocks


def restore_blocks(html, blocks):
    for i, b in enumerate(blocks):
        html = html.replace(f'___BLOCK{i}___', b)
    return html


def wrap_in_text(text, term_pat, data_word):
    """Wrap whole-word / phrase matches that are not already inside a tag attribute or vocab-word."""
    # Only operate on text outside HTML tags
    parts = re.split(r'(<[^>]+>)', text)
    out = []
    for part in parts:
        if part.startswith('<'):
            out.append(part)
            continue
        if not part.strip():
            out.append(part)
            continue
        # Avoid double-wrapping
        def repl(m):
            matched = m.group(0)
            return f'<span class="vocab-word" data-word="{data_word}">{matched}</span>'
        # Case-sensitive match as listed; word boundaries for single tokens
        if ' ' in term_pat or any(c in term_pat for c in "'?"):
            pattern = term_pat
        else:
            pattern = r'\b' + term_pat + r'\b'
        part = re.sub(pattern, repl, part)
        out.append(part)
    return ''.join(out)


def process_html(html):
    if ALREADY.search(html):
        # Already processed — skip to keep idempotent-ish
        # Still allow adding if we want force; for now process carefully
        pass

    html, blocks = protect_blocks(html)

    # Prefer wrapping only in content-heavy sections: split by <section
    sections = re.split(r'(?=<section\b)', html, flags=re.I)
    new_sections = []
    for sec in sections:
        # Always process grammar / vocab / objetivos-like sections; also process general body
        should = True  # process whole lesson carefully; terms list is selective
        if should:
            for pat, data_word in TERMS:
                sec = wrap_in_text(sec, pat, data_word)
        new_sections.append(sec)
    html = ''.join(new_sections)
    html = restore_blocks(html, blocks)
    return html


def main():
    files = sorted(OUT.glob('*.html'))
    # Skip pure game pages that aren't curriculum lessons if desired
    skip = {'custom.html', 'components.html'}
    count = 0
    for f in files:
        if f.name in skip:
            continue
        raw = f.read_text(encoding='utf-8')
        if 'lesson-kit' not in raw and 'BobcatLesson' not in raw:
            # still process Portuguese manuals etc.
            pass
        new = process_html(raw)
        if new != raw:
            f.write_text(new, encoding='utf-8')
            count += 1
            print('updated', f.name)
        else:
            print('unchanged', f.name)
    print(f'Done. Updated {count} files.')


if __name__ == '__main__':
    main()
