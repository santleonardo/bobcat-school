# -*- coding: utf-8 -*-
"""Add 'Próxima lição' navigation buttons to all lessons and PT manuals."""
from pathlib import Path
import re

OUT = Path(__file__).resolve().parent

ENGLISH = [
    ("pronuncia-essencial.html", "Pronúncia Essencial"),
    ("verb-to-be.html", "Lição 1 — Verb To Be"),
    ("saudacoes-apresentacoes.html", "Lição 2 — Saudações"),
    ("licao-3-perguntas-artigos.html", "Lição 3 — Perguntas e Artigos"),
    ("licao-4-revisao-perguntas.html", "Lição 4 — Revisão Perguntas"),
    ("licao-5-preposicoes.html", "Lição 5 — Preposições"),
    ("licao-6-posse.html", "Lição 6 — Posse"),
    ("licao-7-simple-present-daily-life.html", "Lição 7 — Simple Present"),
    ("licao-8-do-does-to-for.html", "Lição 8 — Do/Does · To/For"),
    ("licao-9-perguntas-simple-present.html", "Lição 9 — Perguntas Simple Present"),
    ("licao-10-can-cant.html", "Lição 10 — Can / Can't"),
    ("licao-11-there-is-there-are.html", "Lição 11 — There Is/Are"),
    ("licao-12-here-there.html", "Lição 12 — Here & There"),
    ("licao-13-to-be-passado.html", "Lição 13 — Was/Were"),
    ("licao-14-simple-past-regular.html", "Lição 14 — Simple Past Regular"),
    ("licao-15-simple-past-irregular.html", "Lição 15 — Simple Past Irregular"),
    ("licao-16-future-going-to.html", "Lição 16 — Going To"),
    ("licao-17-future-will.html", "Lição 17 — Will"),
    ("licao-18-revisao-completa.html", "Lição 18 — Revisão A1"),
    ("licao-19-object-possessive-pronouns.html", "Lição 19 — Pronomes Objeto"),
    ("licao-20-present-continuous.html", "Lição 20 — Present Continuous"),
    ("licao-21-countable-uncountable.html", "Lição 21 — Contáveis/Incontáveis"),
    ("licao-22-quantities-choices.html", "Lição 22 — Quantidades"),
    ("licao-23-quantities-distance-time.html", "Lição 23 — Distância e Tempo"),
    ("licao-24-survival-english.html", "Lição 24 — Survival English"),
    ("licao-25-talking-about-the-past.html", "Lição 25 — Falando do Passado"),
    ("licao-26-comparatives-superlatives.html", "Lição 26 — Comparativos"),
    ("licao-27-modal-verbs.html", "Lição 27 — Verbos Modais"),
    ("licao-28-phrasal-verbs.html", "Lição 28 — Phrasal Verbs"),
    ("licao-29-revisao-semestre-2.html", "Lição 29 — Revisão Semestre 2"),
    ("licao-30-past-continuous.html", "Lição 30 — Past Continuous"),
    ("licao-31-simple-past-past-continuous.html", "Lição 31 — Past × Continuous"),
    ("licao-32-present-perfect.html", "Lição 32 — Present Perfect"),
    ("licao-33-present-perfect-experiences.html", "Lição 33 — Experiences"),
    ("licao-34-present-perfect-simple-past.html", "Lição 34 — Perfect × Past"),
    ("licao-35-present-perfect-already-yet-just.html", "Lição 35 — Already/Yet/Just"),
    ("licao-36-future-will-going-to.html", "Lição 36 — Futuro consolidado"),
    ("licao-37-modal-verbs-advice-obligation.html", "Lição 37 — Modais B1"),
    ("licao-38-comparatives-superlatives-equality.html", "Lição 38 — Comparativos B1"),
    ("licao-39-conditionals-zero-first.html", "Lição 39 — Conditionals"),
    ("licao-40-revisao-semestre-3.html", "Lição 40 — Revisão B1"),
]

PB = [
    ("pb-substantivo.html", "Básico 1 — Substantivo"),
    ("pb-artigo.html", "Básico 2 — Artigo"),
    ("pb-adjetivo.html", "Básico 3 — Adjetivo"),
    ("pb-numeral.html", "Básico 4 — Numeral"),
    ("pb-pronome.html", "Básico 5 — Pronome"),
    ("pb-verbo.html", "Básico 6 — Verbo"),
    ("pb-adverbio.html", "Básico 7 — Advérbio"),
    ("pb-preposicao.html", "Básico 8 — Preposição"),
    ("pb-conjuncao.html", "Básico 9 — Conjunção"),
    ("pb-interjeicao.html", "Básico 10 — Interjeição"),
]

PT = [
    ("pt-morfologia.html", "Português 1 — Morfologia"),
    ("pt-sintaxe.html", "Português 2 — Sintaxe"),
    ("pt-concordancia.html", "Português 3 — Concordância"),
    ("pt-regencia.html", "Português 4 — Regência"),
    ("pt-crase.html", "Português 5 — Crase"),
    ("pt-colocacao.html", "Português 6 — Colocação"),
    ("pt-acentuacao.html", "Português 7 — Acentuação"),
    ("pt-ortografia.html", "Português 8 — Ortografia"),
    ("pt-pontuacao.html", "Português 9 — Pontuação"),
    ("pt-interpretacao.html", "Português 10 — Interpretação"),
]

MANUAL_LINKS = {
    "manual-portugues-basico.html": ("pb-substantivo.html", "Básico 1 — Substantivo"),
    "manual-portugues.html": ("pt-morfologia.html", "Português 1 — Morfologia"),
}

EN_NAV_CSS = """
/* Next lesson nav */
.lesson-nav-next{margin-top:20px;text-align:center}
.lesson-nav-next .btn-next-lesson{
  display:inline-flex;flex-direction:column;align-items:center;gap:4px;
  background:var(--orange);color:#fff;border:none;
  padding:14px 22px;border-radius:12px;font-size:15px;font-weight:700;
  text-decoration:none;box-shadow:0 4px 14px rgba(255,91,61,.35);
  transition:transform .15s,background .15s
}
.lesson-nav-next .btn-next-lesson:hover{background:var(--orange-dark);transform:translateY(-1px);color:#fff}
.lesson-nav-next .btn-next-lesson .sub{font-size:12px;font-weight:500;opacity:.9}
"""


def build_next_map(seq):
    m = {}
    for i, (fname, title) in enumerate(seq):
        if i + 1 < len(seq):
            nf, nt = seq[i + 1]
            m[fname] = (nf, nt, False)
        else:
            m[fname] = (None, None, True)
    return m


def en_nav_html(next_file, next_title, is_last):
    if is_last:
        return '''
    <div class="lesson-nav-next reveal">
      <a class="btn-next-lesson" href="../index.html">🎓 Curso completo — Voltar ao app</a>
    </div>'''
    return f'''
    <div class="lesson-nav-next reveal">
      <a class="btn-next-lesson" href="{next_file}">Próxima lição →
        <span class="sub">{next_title}</span>
      </a>
    </div>'''


def pt_nav_html(next_file, next_title, is_last):
    if is_last:
        return '''
        <div class="lesson-nav-next" style="margin-top:24px;text-align:center">
          <a href="../index.html" style="display:inline-flex;align-items:center;gap:8px;background:#C1121F;color:#fff;padding:14px 22px;border-radius:12px;font-size:15px;font-weight:700;text-decoration:none">🎓 Trilha concluída — Voltar ao app</a>
        </div>'''
    return f'''
        <div class="lesson-nav-next" style="margin-top:24px;text-align:center">
          <a href="{next_file}" style="display:inline-flex;flex-direction:column;align-items:center;gap:4px;background:#C1121F;color:#fff;padding:14px 22px;border-radius:12px;font-size:15px;font-weight:700;text-decoration:none;box-shadow:0 4px 14px rgba(193,18,31,.3)">
            <span>Próxima lição →</span>
            <span style="font-size:12px;font-weight:500;opacity:.9">{next_title}</span>
          </a>
        </div>'''


def process_english(fname, next_file, next_title, is_last):
    path = OUT / fname
    if not path.exists():
        print("missing", fname)
        return False
    html = path.read_text(encoding="utf-8")
    if "lesson-nav-next" in html or "btn-next-lesson" in html:
        print("skip", fname)
        return False

    nav = en_nav_html(next_file, next_title, is_last)

    m = re.search(
        r'(<button[^>]*id="btnFinish"[^>]*>.*?</button>\s*'
        r'(?:<p id="finishMsg"[^>]*>.*?</p>\s*)?'
        r'(?:<p id="finishMessage"[^>]*>.*?</p>\s*)?)'
        r'(</div>\s*</section>)',
        html,
        re.S,
    )
    if m:
        html = html[: m.end(1)] + nav + html[m.end(1) :]
    else:
        m2 = re.search(r"(</section>\s*</div>\s*<script)", html, re.S)
        if m2:
            insert = f'\n<section class="section" id="next-lesson"><div style="text-align:center">{nav}</div></section>\n'
            html = html[: m2.start()] + insert + html[m2.start() :]
        else:
            m3 = re.search(r'(<script src="lesson-kit\.js")', html)
            if m3:
                html = html[: m3.start()] + f'<div class="wrap">{nav}</div>\n' + html[m3.start() :]
            else:
                print("no insert point", fname)
                return False

    path.write_text(html, encoding="utf-8")
    print("ok EN", fname)
    return True


def process_pt(fname, next_file, next_title, is_last):
    path = OUT / fname
    if not path.exists():
        print("missing", fname)
        return False
    html = path.read_text(encoding="utf-8")
    if "lesson-nav-next" in html:
        print("skip", fname)
        return False

    nav = pt_nav_html(next_file, next_title, is_last)

    m = re.search(r'(<button[^>]*class="btn-finish"[^>]*>.*?</button>)', html, re.S)
    if m:
        html = html[: m.end(1)] + "\n" + nav + html[m.end(1) :]
    else:
        # Prefer insert before the last script that contains finishLesson or large inline block near body end
        scripts = list(re.finditer(r"<script\b", html))
        if scripts:
            # insert before the last <script>
            pos = scripts[-1].start()
            html = html[:pos] + nav + "\n" + html[pos:]
        else:
            print("no insert point PT", fname)
            return False

    path.write_text(html, encoding="utf-8")
    print("ok PT", fname)
    return True


def main():
    NEXT = {}
    NEXT.update(build_next_map(ENGLISH))
    NEXT.update(build_next_map(PB))
    NEXT.update(build_next_map(PT))
    NEXT.update({k: (v[0], v[1], False) for k, v in MANUAL_LINKS.items()})

    kit_css = OUT / "lesson-kit.css"
    if kit_css.exists():
        css = kit_css.read_text(encoding="utf-8")
        if ".btn-next-lesson" not in css:
            kit_css.write_text(css + "\n" + EN_NAV_CSS, encoding="utf-8")
            print("CSS added to lesson-kit.css")

    n = 0
    for fname, (nf, nt, last) in NEXT.items():
        if fname.startswith(("pb-", "pt-", "manual-")):
            if process_pt(fname, nf, nt, last):
                n += 1
        else:
            if process_english(fname, nf, nt, last):
                n += 1
    print(f"Updated {n} files")


if __name__ == "__main__":
    main()
