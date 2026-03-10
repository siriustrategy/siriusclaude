// ============================================================
// PLAYBOOK HUMANO — ATENDENTES | PROJETO INADIMPLÊNCIA
// Plano Mais Assistencial
//
// COMO USAR:
// 1. Acesse script.google.com
// 2. Crie um novo projeto
// 3. Cole este código
// 4. Clique em "Executar" → criarPlaybookHumano()
// 5. Autorize o acesso quando solicitado
// 6. O Google Slides será criado no seu Drive
// ============================================================

function criarPlaybookHumano() {

  // ── BRAND COLORS (Plano Mais Oficial) ──────────────────
  var C = {
    NAVY:    '#002073',
    BLUE:    '#0D3DCC',
    BLUE_D:  '#0330B1',
    TEAL:    '#50F7E8',
    CYAN:    '#A1E4ED',
    MAGENTA: '#E81B8F',
    WHITE:   '#FFFFFF',
    DARK:    '#282828',
    GRAY:    '#524D4D',
    LGRAY:   '#D4D0D0',
    OFFWHT:  '#F4F7FC',
    GREEN:   '#1E8449',
    RED:     '#C0392B',
    AMBER:   '#D68910',
    PURPLE:  '#5B489D',
  };

  // ── DIMENSÕES (720×405pt = 16:9) ───────────────────────
  var W = 720, H = 405;

  // ── CRIAR APRESENTAÇÃO ─────────────────────────────────
  var pres = SlidesApp.create('Playbook Atendentes — Projeto Inadimplência | Plano Mais');
  var slides = pres.getSlides();

  // ── FUNÇÕES AUXILIARES ─────────────────────────────────

  function limparSlide(s) {
    s.getShapes().forEach(function(sh) { sh.remove(); });
    s.getTables().forEach(function(t) { t.remove(); });
  }

  function bg(s, cor) {
    s.getBackground().setSolidFill(cor);
  }

  function barra(s, y, altura, cor) {
    var r = s.insertShape(SlidesApp.ShapeType.RECTANGLE, 0, y, W, altura);
    r.getFill().setSolidFill(cor);
    r.getBorder().setTransparent();
    return r;
  }

  function txt(s, texto, x, y, w, h, opts) {
    var b = s.insertTextBox(texto, x, y, w, h);
    b.getFill().setTransparent();
    b.getBorder().setTransparent();
    var st = b.getText().getTextStyle();
    st.setForegroundColor(opts.cor || C.DARK);
    st.setFontFamily(opts.fonte || 'Inter');
    st.setFontSize(opts.tam || 12);
    if (opts.bold) st.setBold(true);
    if (opts.italic) st.setItalic(true);
    var ps = b.getText().getParagraphStyle();
    if (opts.align === 'center') ps.setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);
    if (opts.align === 'end') ps.setParagraphAlignment(SlidesApp.ParagraphAlignment.END);
    return b;
  }

  function caixaColorida(s, x, y, w, h, corFundo, texto, corTexto, tamTexto, negrito) {
    var box = s.insertShape(SlidesApp.ShapeType.ROUND_RECTANGLE, x, y, w, h);
    box.getFill().setSolidFill(corFundo);
    box.getBorder().setTransparent();
    var t = box.getText();
    t.setText(texto);
    var st = t.getTextStyle();
    st.setForegroundColor(corTexto || C.WHITE);
    st.setFontFamily('Inter');
    st.setFontSize(tamTexto || 11);
    if (negrito) st.setBold(true);
    t.getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);
    return box;
  }

  function cabecalhoSlide(s, titulo, subtitulo) {
    barra(s, 0, 54, C.NAVY);
    barra(s, 54, 3, C.TEAL);
    txt(s, titulo, 28, 10, 600, 34, {cor: C.WHITE, fonte: 'Poppins', tam: 22, bold: true});
    if (subtitulo) txt(s, subtitulo, 28, 38, 600, 18, {cor: C.CYAN, fonte: 'Inter', tam: 10});
    barra(s, H-4, 4, C.BLUE);
  }

  function tagMes(s, label, cor) {
    var tag = s.insertShape(SlidesApp.ShapeType.ROUND_RECTANGLE, W-130, 8, 115, 26);
    tag.getFill().setSolidFill(cor);
    tag.getBorder().setTransparent();
    tag.getText().setText(label);
    var st = tag.getText().getTextStyle();
    st.setForegroundColor(C.WHITE);
    st.setFontFamily('Poppins');
    st.setFontSize(10);
    st.setBold(true);
    tag.getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);
  }

  function adicionarSlide() {
    var s = pres.appendSlide(SlidesApp.PredefinedLayout.BLANK);
    limparSlide(s);
    bg(s, C.WHITE);
    return s;
  }

  // ══════════════════════════════════════════════════════
  // SLIDE 1 — CAPA
  // ══════════════════════════════════════════════════════
  var s1 = slides[0];
  limparSlide(s1);
  bg(s1, C.NAVY);

  barra(s1, 0, 5, C.BLUE);
  barra(s1, H-5, 5, C.TEAL);

  // Faixa direita decorativa
  var faixa = s1.insertShape(SlidesApp.ShapeType.RECTANGLE, W-100, 0, 100, H);
  faixa.getFill().setSolidFill(C.BLUE_D);
  faixa.getBorder().setTransparent();

  // Linha teal diagonal simulada por retângulo girado
  var linha = s1.insertShape(SlidesApp.ShapeType.RECTANGLE, W-105, 0, 8, H);
  linha.getFill().setSolidFill(C.TEAL);
  linha.getBorder().setTransparent();

  // Tag projeto
  var tagProjeto = s1.insertShape(SlidesApp.ShapeType.ROUND_RECTANGLE, 60, 80, 220, 24);
  tagProjeto.getFill().setSolidFill(C.BLUE);
  tagProjeto.getBorder().setTransparent();
  tagProjeto.getText().setText('  PROJETO INADIMPLÊNCIA');
  var tpSt = tagProjeto.getText().getTextStyle();
  tpSt.setForegroundColor(C.WHITE);
  tpSt.setFontFamily('Poppins');
  tpSt.setFontSize(9);
  tpSt.setBold(true);

  txt(s1, 'PLAYBOOK DE\nCOBRANÇA', 60, 115, 480, 130, {cor: C.WHITE, fonte: 'Poppins', tam: 54, bold: true});
  txt(s1, 'Guia Operacional das Atendentes', 62, 258, 480, 30, {cor: C.CYAN, fonte: 'Inter', tam: 17});
  txt(s1, 'Plano Mais Assistencial  ·  2026', 62, H-38, 300, 22, {cor: C.LGRAY, fonte: 'Inter', tam: 10});

  // ══════════════════════════════════════════════════════
  // SLIDE 2 — SEU PAPEL
  // ══════════════════════════════════════════════════════
  var s2 = adicionarSlide();
  cabecalhoSlide(s2, 'SEU PAPEL', 'O que muda com a automação');

  var papeis = [
    {icone: '1', titulo: 'O robô cobra', desc: 'Disparos automáticos,\nlembretes e links de pagamento', cor: C.BLUE},
    {icone: '2', titulo: 'Você converte', desc: 'Transforma objeções\nem pagamentos confirmados', cor: C.PURPLE},
    {icone: '3', titulo: 'Você humaniza', desc: 'Entra quando o robô\nnão consegue resolver', cor: C.MAGENTA},
  ];

  var px = 40, py = 80, pw = 190, ph = 240;
  papeis.forEach(function(p, i) {
    var bx = px + i * (pw + 25);
    var card = s2.insertShape(SlidesApp.ShapeType.ROUND_RECTANGLE, bx, py, pw, ph);
    card.getFill().setSolidFill(C.OFFWHT);
    card.getBorder().setTransparent();

    var head = s2.insertShape(SlidesApp.ShapeType.ROUND_RECTANGLE, bx, py, pw, 52);
    head.getFill().setSolidFill(p.cor);
    head.getBorder().setTransparent();
    head.getText().setText(p.icone);
    var hSt = head.getText().getTextStyle();
    hSt.setForegroundColor(C.WHITE);
    hSt.setFontFamily('Poppins');
    hSt.setFontSize(22);
    hSt.setBold(true);
    head.getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);

    txt(s2, p.titulo, bx+10, py+60, pw-20, 28, {cor: C.DARK, fonte: 'Poppins', tam: 13, bold: true});
    txt(s2, p.desc, bx+10, py+92, pw-20, 70, {cor: C.GRAY, fonte: 'Inter', tam: 11});
  });

  txt(s2, '"Você não cobra. Você resolve."', 40, H-42, 640, 28, {cor: C.BLUE, fonte: 'Poppins', tam: 13, bold: true, align: 'center'});

  // ══════════════════════════════════════════════════════
  // SLIDE 3 — PERFIS DAS ATENDENTES
  // ══════════════════════════════════════════════════════
  var s3 = adicionarSlide();
  cabecalhoSlide(s3, 'PERFIS DAS ATENDENTES', 'Cada atendente tem foco e leads prioritários');

  var tabPerfis = s3.insertTable(4, 3, 30, 72, 660, 290);

  var hCores = [C.BLUE, C.BLUE, C.BLUE];
  var hTextos = ['ATENDENTE', 'ESPECIALIDADE', 'LEADS PRIORITÁRIOS'];
  hTextos.forEach(function(t, c) {
    var cell = tabPerfis.getCell(0, c);
    cell.getFill().setSolidFill(C.NAVY);
    cell.getText().setText(t);
    var st = cell.getText().getTextStyle();
    st.setForegroundColor(C.WHITE);
    st.setFontFamily('Poppins');
    st.setFontSize(10);
    st.setBold(true);
    cell.getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);
  });

  var dadosPerfis = [
    ['Atendente A', 'Negociação e fechamento\nde pagamentos', 'Meses 3 e 4\n(descontos de 5% e 15%)'],
    ['Atendente B', 'Retenção\n(risco de cancelamento)', 'Qualquer mês quando\no lead disser "quero cancelar"'],
    ['Atendente C', 'Diagnóstico e empatia\n(casos difíceis)', 'Meses 4, 5 e\npós D+150'],
  ];

  dadosPerfis.forEach(function(row, r) {
    row.forEach(function(cell_text, c) {
      var cell = tabPerfis.getCell(r+1, c);
      cell.getFill().setSolidFill(r % 2 === 0 ? C.WHITE : C.OFFWHT);
      cell.getText().setText(cell_text);
      var st = cell.getText().getTextStyle();
      st.setForegroundColor(c === 0 ? C.BLUE : C.DARK);
      st.setFontFamily(c === 0 ? 'Poppins' : 'Inter');
      st.setFontSize(11);
      if (c === 0) st.setBold(true);
      cell.getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);
    });
  });

  txt(s3, 'O gestor distribui a fila toda manhã conforme prioridade do dashboard.', 30, H-34, 660, 22, {cor: C.GRAY, fonte: 'Inter', tam: 10, italic: true, align: 'center'});

  // ══════════════════════════════════════════════════════
  // SLIDE 4 — FICHA DO LEAD
  // ══════════════════════════════════════════════════════
  var s4 = adicionarSlide();
  cabecalhoSlide(s4, 'FICHA DO LEAD — O QUE VER ANTES DE FALAR', 'Sempre leia a ficha completa antes de abrir o chat');

  var campos = [
    ['NOME', 'Maria Silva'],
    ['PLANO', 'Prime (R$ 39,90/mês)'],
    ['DIAS EM ATRASO', '78 dias'],
    ['VALOR EM ABERTO', 'R$ 119,70'],
    ['MOTIVO REGISTRADO', 'Financeiro'],
    ['BAIRRO / CIDADE', 'Braga / Cabo Frio'],
    ['DEPENDENTES', '2 filhos (8 e 12 anos)'],
    ['PET', 'Sim (cachorro)'],
    ['DESCONTO JÁ CONCEDIDO', 'Não'],
  ];

  var cx = 35, cy = 74, cw = 310, ch = 24;
  campos.forEach(function(campo, i) {
    var row_y = cy + i * (ch + 2);
    var labelBox = s4.insertShape(SlidesApp.ShapeType.RECTANGLE, cx, row_y, 150, ch);
    labelBox.getFill().setSolidFill(i % 2 === 0 ? C.NAVY : C.BLUE_D);
    labelBox.getBorder().setTransparent();
    labelBox.getText().setText('  ' + campo[0]);
    var lst = labelBox.getText().getTextStyle();
    lst.setForegroundColor(C.WHITE);
    lst.setFontFamily('Inter');
    lst.setFontSize(9);
    lst.setBold(true);

    var valBox = s4.insertShape(SlidesApp.ShapeType.RECTANGLE, cx+150, row_y, 200, ch);
    valBox.getFill().setSolidFill(i % 2 === 0 ? C.OFFWHT : C.WHITE);
    valBox.getBorder().setTransparent();
    valBox.getText().setText('  ' + campo[1]);
    var vst = valBox.getText().getTextStyle();
    vst.setForegroundColor(C.DARK);
    vst.setFontFamily('Inter');
    vst.setFontSize(9);
  });

  // Coluna direita - regras
  txt(s4, 'REGRA DE OURO', 380, 74, 300, 22, {cor: C.NAVY, fonte: 'Poppins', tam: 12, bold: true});

  var regras = [
    {t: 'Leia a ficha ANTES de abrir o chat', c: C.DARK},
    {t: 'Cheque o histórico de pagamentos', c: C.DARK},
    {t: 'Veja se já teve desconto concedido', c: C.DARK},
    {t: 'Se cancelamento → escalar AGORA', c: C.RED},
    {t: 'Nunca repita o que o robô já disse', c: C.GRAY},
  ];
  regras.forEach(function(r, i) {
    var ry = 102 + i * 38;
    var dot = s4.insertShape(SlidesApp.ShapeType.ELLIPSE, 382, ry+8, 8, 8);
    dot.getFill().setSolidFill(i === 3 ? C.RED : C.TEAL);
    dot.getBorder().setTransparent();
    txt(s4, r.t, 396, ry+2, 310, 28, {cor: r.c, fonte: 'Inter', tam: 11});
  });

  // ══════════════════════════════════════════════════════
  // SLIDE 5 — TOM DE VOZ
  // ══════════════════════════════════════════════════════
  var s5 = adicionarSlide();
  cabecalhoSlide(s5, 'TOM DE VOZ PLANO MAIS', 'Como falar — e como não falar');

  var tabTom = s5.insertTable(6, 2, 30, 70, 660, 300);

  var tomHeader = [['EVITAR', 'USAR']];
  var tomDados = [
    ['❌  "Você está em débito"', '✓  "Sua mensalidade está em aberto"'],
    ['❌  "Você precisa pagar"', '✓  "Quero te ajudar a regularizar"'],
    ['❌  "Caso contrário será cancelado"', '✓  "Seus benefícios ficam bloqueados enquanto estiver em aberto"'],
    ['❌  "Já são X meses sem pagar"', '✓  "Faz um tempo que você está sem acesso ao plano"'],
    ['❌  "Não posso fazer isso"', '✓  "O que eu consigo fazer por você é..."'],
  ];

  var s5Header = tabTom.getCell(0, 0);
  s5Header.getFill().setSolidFill(C.RED);
  s5Header.getText().setText('  EVITAR');
  var s5hSt = s5Header.getText().getTextStyle();
  s5hSt.setForegroundColor(C.WHITE); s5hSt.setFontFamily('Poppins'); s5hSt.setFontSize(11); s5hSt.setBold(true);

  var s5Header2 = tabTom.getCell(0, 1);
  s5Header2.getFill().setSolidFill(C.GREEN);
  s5Header2.getText().setText('  USAR');
  var s5h2St = s5Header2.getText().getTextStyle();
  s5h2St.setForegroundColor(C.WHITE); s5h2St.setFontFamily('Poppins'); s5h2St.setFontSize(11); s5h2St.setBold(true);

  tomDados.forEach(function(row, r) {
    var cellE = tabTom.getCell(r+1, 0);
    cellE.getFill().setSolidFill(r % 2 === 0 ? '#FEF2F2' : C.WHITE);
    cellE.getText().setText(row[0]);
    var ceS = cellE.getText().getTextStyle();
    ceS.setForegroundColor(C.RED); ceS.setFontFamily('Inter'); ceS.setFontSize(10);

    var cellU = tabTom.getCell(r+1, 1);
    cellU.getFill().setSolidFill(r % 2 === 0 ? '#F0FDF4' : C.WHITE);
    cellU.getText().setText(row[1]);
    var cuS = cellU.getText().getTextStyle();
    cuS.setForegroundColor(C.GREEN); cuS.setFontFamily('Inter'); cuS.setFontSize(10);
  });

  // ══════════════════════════════════════════════════════
  // SLIDE 6 — TOM POR FAIXA ETÁRIA
  // ══════════════════════════════════════════════════════
  var s6 = adicionarSlide();
  cabecalhoSlide(s6, 'TOM POR FAIXA ETÁRIA', 'Adapte a linguagem ao perfil do lead');

  var faixas = [
    {
      label: 'ATÉ 40 ANOS',
      cor: C.BLUE,
      items: ['Tom descontraído e direto', 'Foco em praticidade', 'Mensagens mais curtas', 'Pode usar linguagem informal']
    },
    {
      label: '40 A 55 ANOS',
      cor: C.PURPLE,
      items: ['Tom equilibrado', 'Foco em valor e benefícios', 'Empático e claro', 'Linguagem padrão']
    },
    {
      label: 'ACIMA DE 55',
      cor: C.NAVY,
      items: ['Tom mais formal', 'Foco em segurança e proteção', 'Mensagens pausadas', 'Evitar abreviações']
    },
  ];

  faixas.forEach(function(f, i) {
    var fx = 35 + i * 220, fy = 74, fw = 205, fh = 285;

    var cardBg = s6.insertShape(SlidesApp.ShapeType.ROUND_RECTANGLE, fx, fy, fw, fh);
    cardBg.getFill().setSolidFill(C.OFFWHT);
    cardBg.getBorder().setTransparent();

    var cardHead = s6.insertShape(SlidesApp.ShapeType.ROUND_RECTANGLE, fx, fy, fw, 44);
    cardHead.getFill().setSolidFill(f.cor);
    cardHead.getBorder().setTransparent();
    cardHead.getText().setText(f.label);
    var chs = cardHead.getText().getTextStyle();
    chs.setForegroundColor(C.WHITE); chs.setFontFamily('Poppins'); chs.setFontSize(11); chs.setBold(true);
    cardHead.getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);

    f.items.forEach(function(item, j) {
      var iy = fy + 54 + j * 52;
      var dot = s6.insertShape(SlidesApp.ShapeType.ELLIPSE, fx+14, iy+8, 7, 7);
      dot.getFill().setSolidFill(f.cor);
      dot.getBorder().setTransparent();
      txt(s6, item, fx+28, iy, fw-36, 42, {cor: C.DARK, fonte: 'Inter', tam: 10});
    });
  });

  // ══════════════════════════════════════════════════════
  // SLIDE 7 — SCRIPTS MÊS 1
  // ══════════════════════════════════════════════════════
  var s7 = adicionarSlide();
  cabecalhoSlide(s7, 'MÊS 1 — RECUPERAÇÃO SUAVE', 'D+1 a D+30 · Zero desconto · Robô protagonista');
  tagMes(s7, 'D+1 A D+30', C.GREEN);

  // Info pill
  var pill1 = s7.insertShape(SlidesApp.ShapeType.ROUND_RECTANGLE, 30, 72, 120, 22);
  pill1.getFill().setSolidFill(C.GREEN);
  pill1.getBorder().setTransparent();
  pill1.getText().setText('  0% de desconto');
  var p1s = pill1.getText().getTextStyle();
  p1s.setForegroundColor(C.WHITE); p1s.setFontFamily('Inter'); p1s.setFontSize(9); p1s.setBold(true);

  txt(s7, 'QUANDO VOCÊ ENTRA:', 30, 102, 320, 20, {cor: C.NAVY, fonte: 'Poppins', tam: 11, bold: true});
  var quando1 = ['Lead diz "quero cancelar" → IMEDIATO', 'Lead pede atendente humano', 'Robô não entende 2x seguidas'];
  quando1.forEach(function(q, i) {
    var dot = s7.insertShape(SlidesApp.ShapeType.ELLIPSE, 32, 128 + i*28 + 6, 7, 7);
    dot.getFill().setSolidFill(C.RED);
    dot.getBorder().setTransparent();
    txt(s7, q, 46, 128 + i*28, 310, 26, {cor: i === 0 ? C.RED : C.DARK, fonte: 'Inter', tam: 10, bold: i === 0});
  });

  // Script box
  var scriptBox7 = s7.insertShape(SlidesApp.ShapeType.ROUND_RECTANGLE, 370, 68, 320, 290);
  scriptBox7.getFill().setSolidFill(C.OFFWHT);
  scriptBox7.getBorder().setTransparent();

  var scriptHead7 = s7.insertShape(SlidesApp.ShapeType.ROUND_RECTANGLE, 370, 68, 320, 30);
  scriptHead7.getFill().setSolidFill(C.BLUE);
  scriptHead7.getBorder().setTransparent();
  scriptHead7.getText().setText('  SCRIPT — CANCELAMENTO');
  var sh7s = scriptHead7.getText().getTextStyle();
  sh7s.setForegroundColor(C.WHITE); sh7s.setFontFamily('Poppins'); sh7s.setFontSize(9); sh7s.setBold(true);

  var scriptText7 = '"Oi [NOME]! Aqui é a [SEU NOME] do Plano Mais.\nVi que você está pensando em cancelar e quis\nentender o que aconteceu. Pode me contar?\n\n→ Ouça sem interromper\n→ Identifique o motivo real\n→ Use o script de retenção correto"';
  txt(s7, scriptText7, 378, 105, 304, 240, {cor: C.DARK, fonte: 'Inter', tam: 10});

  txt(s7, 'Lembre: sem desconto neste mês. Facilite o pagamento normal.', 30, H-34, 660, 22, {cor: C.GRAY, fonte: 'Inter', tam: 9, italic: true, align: 'center'});

  // ══════════════════════════════════════════════════════
  // SLIDE 8 — SCRIPTS MÊS 2
  // ══════════════════════════════════════════════════════
  var s8 = adicionarSlide();
  cabecalhoSlide(s8, 'MÊS 2 — PRESSÃO', 'D+31 a D+60 · Zero desconto · Foco na perda');
  tagMes(s8, 'D+31 A D+60', C.AMBER);

  var pill8 = s8.insertShape(SlidesApp.ShapeType.ROUND_RECTANGLE, 30, 72, 120, 22);
  pill8.getFill().setSolidFill(C.AMBER);
  pill8.getBorder().setTransparent();
  pill8.getText().setText('  0% de desconto');
  var p8s = pill8.getText().getTextStyle();
  p8s.setForegroundColor(C.WHITE); p8s.setFontFamily('Inter'); p8s.setFontSize(9); p8s.setBold(true);

  txt(s8, 'GATILHO: Lead com dificuldade financeira grave', 30, 102, 340, 20, {cor: C.RED, fonte: 'Poppins', tam: 10, bold: true});

  var scriptBox8 = s8.insertShape(SlidesApp.ShapeType.ROUND_RECTANGLE, 30, 128, 660, 200);
  scriptBox8.getFill().setSolidFill(C.OFFWHT);
  scriptBox8.getBorder().setTransparent();

  var sh8 = s8.insertShape(SlidesApp.ShapeType.ROUND_RECTANGLE, 30, 128, 660, 28);
  sh8.getFill().setSolidFill(C.AMBER);
  sh8.getBorder().setTransparent();
  sh8.getText().setText('  SCRIPT — DIFICULDADE FINANCEIRA');
  var sh8s = sh8.getText().getTextStyle();
  sh8s.setForegroundColor(C.WHITE); sh8s.setFontFamily('Poppins'); sh8s.setFontSize(9); sh8s.setBold(true);

  var st8 = '"[NOME], vi aqui que você mencionou estar passando por um\nmomento difícil. Entendo completamente — isso acontece.\n\nQuero só te dizer que seus benefícios vão ficar guardados\npara quando você puder.\n\nQuando você acha que consegue regularizar?\nNem que seja uma parte agora."';
  txt(s8, st8, 40, 162, 640, 160, {cor: C.DARK, fonte: 'Inter', tam: 11});

  // Regras embaixo
  var regras8 = [
    {t: 'SE informar data → registrar + agendar lembrete no sistema', c: C.GREEN},
    {t: 'SE não souber → "Vou guardar seu acesso e mando um lembrete"', c: C.BLUE},
    {t: 'NÃO oferecer desconto ainda — a carta ainda não foi jogada', c: C.RED},
  ];
  regras8.forEach(function(r, i) {
    var dot = s8.insertShape(SlidesApp.ShapeType.ELLIPSE, 32, H-68+i*20+5, 7, 7);
    dot.getFill().setSolidFill(r.c);
    dot.getBorder().setTransparent();
    txt(s8, r.t, 46, H-68+i*20, 660, 18, {cor: r.c, fonte: 'Inter', tam: 9, bold: true});
  });

  // ══════════════════════════════════════════════════════
  // SLIDE 9 — SCRIPTS MÊS 3
  // ══════════════════════════════════════════════════════
  var s9 = adicionarSlide();
  cabecalhoSlide(s9, 'MÊS 3 — NEGOCIAÇÃO', 'D+61 a D+90 · 1ª carta de desconto: 5%');
  tagMes(s9, 'D+61 A D+90', C.PURPLE);

  var pill9 = s9.insertShape(SlidesApp.ShapeType.ROUND_RECTANGLE, 30, 72, 145, 22);
  pill9.getFill().setSolidFill(C.PURPLE);
  pill9.getBorder().setTransparent();
  pill9.getText().setText('  Desconto autorizado: 5%');
  var p9s = pill9.getText().getTextStyle();
  p9s.setForegroundColor(C.WHITE); p9s.setFontFamily('Inter'); p9s.setFontSize(9); p9s.setBold(true);

  // 2 scripts lado a lado
  var scripts9 = [
    {
      titulo: 'SCRIPT A — LEAD ACEITOU',
      cor: C.GREEN,
      texto: '"Oi [NOME]! Ótima escolha!\nVou gerar seu link com o valor\ncom desconto agora.\n\nSão R$[VALOR_COM_DESCONTO]\npara regularizar tudo.\n\nAssim seus benefícios voltam\nna hora que confirmar o pag."'
    },
    {
      titulo: 'SCRIPT B — PEDIU MAIS DESCONTO',
      cor: C.RED,
      texto: '"[NOME], entendo! Olha, o que\nconsigo fazer por você agora\né esse desconto de 5% —\né o máximo que tenho.\n\nSe quiser aceitar, o link está\naqui. Se não conseguir ainda,\nme fala e a gente pensa\nem outra solução."'
    },
  ];

  scripts9.forEach(function(sc, i) {
    var sx = 30 + i * 340, sy = 100, sw = 324, sh_h = 250;
    var scBox = s9.insertShape(SlidesApp.ShapeType.ROUND_RECTANGLE, sx, sy, sw, sh_h);
    scBox.getFill().setSolidFill(C.OFFWHT);
    scBox.getBorder().setTransparent();

    var scHead = s9.insertShape(SlidesApp.ShapeType.ROUND_RECTANGLE, sx, sy, sw, 28);
    scHead.getFill().setSolidFill(sc.cor);
    scHead.getBorder().setTransparent();
    scHead.getText().setText('  ' + sc.titulo);
    var schs = scHead.getText().getTextStyle();
    schs.setForegroundColor(C.WHITE); schs.setFontFamily('Poppins'); schs.setFontSize(8); schs.setBold(true);

    txt(s9, sc.texto, sx+10, sy+35, sw-20, sh_h-42, {cor: C.DARK, fonte: 'Inter', tam: 10});
  });

  txt(s9, '⚠  NÃO aumentar desconto no Mês 3 mesmo com pressão. Registrar pedido no campo NEGOCIAÇÃO do CRM.', 30, H-30, 660, 22, {cor: C.AMBER, fonte: 'Inter', tam: 9, bold: true, align: 'center'});

  // ══════════════════════════════════════════════════════
  // SLIDE 10 — SCRIPTS MÊS 4
  // ══════════════════════════════════════════════════════
  var s10 = adicionarSlide();
  cabecalhoSlide(s10, 'MÊS 4 — OFERTA REAL', 'D+91 a D+120 · Você é protagonista · Desconto 15%');
  tagMes(s10, 'D+91 A D+120', C.BLUE_D);

  var pills10 = [
    {t: 'Desconto: 15%', c: C.BLUE_D},
    {t: 'Parcelamento: até 3x', c: C.PURPLE},
    {t: 'Você lidera', c: C.NAVY},
  ];
  pills10.forEach(function(p, i) {
    var px10 = 30 + i*140;
    var pill = s10.insertShape(SlidesApp.ShapeType.ROUND_RECTANGLE, px10, 72, 130, 22);
    pill.getFill().setSolidFill(p.c);
    pill.getBorder().setTransparent();
    pill.getText().setText('  ' + p.t);
    var pst = pill.getText().getTextStyle();
    pst.setForegroundColor(C.WHITE); pst.setFontFamily('Inter'); pst.setFontSize(9); pst.setBold(true);
  });

  var sc10a = s10.insertShape(SlidesApp.ShapeType.ROUND_RECTANGLE, 30, 100, 320, 260);
  sc10a.getFill().setSolidFill(C.OFFWHT);
  sc10a.getBorder().setTransparent();
  var h10a = s10.insertShape(SlidesApp.ShapeType.ROUND_RECTANGLE, 30, 100, 320, 28);
  h10a.getFill().setSolidFill(C.BLUE_D);
  h10a.getBorder().setTransparent();
  h10a.getText().setText('  SCRIPT A — ABERTURA');
  var h10as = h10a.getText().getTextStyle();
  h10as.setForegroundColor(C.WHITE); h10as.setFontFamily('Poppins'); h10as.setFontSize(8); h10as.setBold(true);

  var st10a = '"[NOME], são [X] dias sem o plano.\nQueria entender o que aconteceu.\n\nSem julgamento — quero ver o\nque posso fazer para te ajudar\na voltar de um jeito que caiba\nno seu bolso.\n\nMe conta: o que travou?"';
  txt(s10, st10a, 40, 135, 302, 218, {cor: C.DARK, fonte: 'Inter', tam: 10});

  var sc10b = s10.insertShape(SlidesApp.ShapeType.ROUND_RECTANGLE, 366, 100, 324, 260);
  sc10b.getFill().setSolidFill(C.OFFWHT);
  sc10b.getBorder().setTransparent();
  var h10b = s10.insertShape(SlidesApp.ShapeType.ROUND_RECTANGLE, 366, 100, 324, 28);
  h10b.getFill().setSolidFill(C.PURPLE);
  h10b.getBorder().setTransparent();
  h10b.getText().setText('  SCRIPT B — PROPOSTA DE PARCELAMENTO');
  var h10bs = h10b.getText().getTextStyle();
  h10bs.setForegroundColor(C.WHITE); h10bs.setFontFamily('Poppins'); h10bs.setFontSize(8); h10bs.setBold(true);

  var st10b = '"Olha o que posso fazer:\n\nVocê deve [X] mensalidades.\nCom 15% de desconto, fica\nR$[VALOR_FINAL].\n\nParcelo em [2x ou 3x] sem juros.\nPaga a 1ª parcela agora e o plano\njá reativa imediatamente.\n\nO que acha?"';
  txt(s10, st10b, 376, 135, 306, 218, {cor: C.DARK, fonte: 'Inter', tam: 10});

  txt(s10, 'Parcelamento acima de 3x → gerar link de pagamento para o valor total com desconto.', 30, H-30, 660, 22, {cor: C.AMBER, fonte: 'Inter', tam: 9, bold: true, align: 'center'});

  // ══════════════════════════════════════════════════════
  // SLIDE 11 — SCRIPTS MÊS 5
  // ══════════════════════════════════════════════════════
  var s11 = adicionarSlide();
  cabecalhoSlide(s11, 'MÊS 5 — ÚLTIMA CHANCE', 'D+121 a D+150 · Melhor oferta · Tom direto');
  tagMes(s11, 'D+121 A D+150', C.RED);

  var pill11 = s11.insertShape(SlidesApp.ShapeType.ROUND_RECTANGLE, 30, 72, 155, 22);
  pill11.getFill().setSolidFill(C.RED);
  pill11.getBorder().setTransparent();
  pill11.getText().setText('  Desconto final: 20% · Não acumula');
  var p11s = pill11.getText().getTextStyle();
  p11s.setForegroundColor(C.WHITE); p11s.setFontFamily('Inter'); p11s.setFontSize(9); p11s.setBold(true);

  var sc11a = s11.insertShape(SlidesApp.ShapeType.ROUND_RECTANGLE, 30, 100, 316, 258);
  sc11a.getFill().setSolidFill(C.OFFWHT);
  sc11a.getBorder().setTransparent();
  var h11a = s11.insertShape(SlidesApp.ShapeType.ROUND_RECTANGLE, 30, 100, 316, 28);
  h11a.getFill().setSolidFill(C.RED);
  h11a.getBorder().setTransparent();
  h11a.getText().setText('  SCRIPT A — OFERTA FINAL');
  var h11as = h11a.getText().getTextStyle();
  h11as.setForegroundColor(C.WHITE); h11as.setFontFamily('Poppins'); h11as.setFontSize(8); h11as.setBold(true);
  txt(s11, '"[NOME], vou ser direta porque\nme importo.\n\nEsse é o último mês antes\ndo encerramento.\n\n20% de desconto + parcelo em 3x.\nTotal: R$[VALOR] em vez de\nR$[VALOR_ORIGINAL].\n\nNão tenho nada melhor que isso.\nSe quiser voltar, é agora."', 40, 135, 298, 216, {cor: C.DARK, fonte: 'Inter', tam: 10});

  var sc11b = s11.insertShape(SlidesApp.ShapeType.ROUND_RECTANGLE, 362, 100, 328, 258);
  sc11b.getFill().setSolidFill(C.OFFWHT);
  sc11b.getBorder().setTransparent();
  var h11b = s11.insertShape(SlidesApp.ShapeType.ROUND_RECTANGLE, 362, 100, 328, 28);
  h11b.getFill().setSolidFill(C.GRAY);
  h11b.getBorder().setTransparent();
  h11b.getText().setText('  SCRIPT B — ENCERRAMENTO COM DIGNIDADE');
  var h11bs = h11b.getText().getTextStyle();
  h11bs.setForegroundColor(C.WHITE); h11bs.setFontFamily('Poppins'); h11bs.setFontSize(8); h11bs.setBold(true);
  txt(s11, '"Entendo, [NOME]. Respeito\nsua decisão.\n\nAntes de encerrar: tem algum\nmotivo que eu possa registrar?\nServe para a gente melhorar.\n\nSeu histórico fica guardado.\nSe quiser voltar algum dia,\né só chamar."', 372, 135, 308, 216, {cor: C.DARK, fonte: 'Inter', tam: 10});

  txt(s11, 'Após script B → registrar motivo no CRM + aplicar tag de arquivamento.', 30, H-30, 660, 22, {cor: C.GRAY, fonte: 'Inter', tam: 9, italic: true, align: 'center'});

  // ══════════════════════════════════════════════════════
  // SLIDE 12 — MATRIZ DE ESCALAÇÃO
  // ══════════════════════════════════════════════════════
  var s12 = adicionarSlide();
  cabecalhoSlide(s12, 'MATRIZ DE ESCALAÇÃO', 'Quando agir imediatamente');

  var tabEsc = s12.insertTable(7, 2, 30, 68, 660, 300);

  var escHeader = [['SITUAÇÃO', 'AÇÃO IMEDIATA']];
  var escDados = [
    ['Lead diz "cancelar", "quero sair", "encerrar"', 'Atendente B assume — URGENTE (alerta vermelho)'],
    ['Lead menciona "Procon", "reclamação", "processo"', 'Acionar Gestor imediatamente'],
    ['Lead Platinum/Premium no Mês 4 ou 5', 'Gestor assume pessoalmente'],
    ['Lead sem resposta por 5+ dias', 'Gestor revisa e decide próxima ação'],
    ['Lead em luto ou situação de saúde grave', 'Atendente C + tom especial de acolhimento'],
    ['Parcelamento > 3x solicitado', 'Gerar link de pagamento para valor total com desconto'],
  ];

  var escCels = [['SITUAÇÃO', 'AÇÃO IMEDIATA']];
  var sh12a = tabEsc.getCell(0, 0);
  sh12a.getFill().setSolidFill(C.NAVY);
  sh12a.getText().setText('  SITUAÇÃO');
  var sh12as = sh12a.getText().getTextStyle();
  sh12as.setForegroundColor(C.WHITE); sh12as.setFontFamily('Poppins'); sh12as.setFontSize(10); sh12as.setBold(true);

  var sh12b = tabEsc.getCell(0, 1);
  sh12b.getFill().setSolidFill(C.RED);
  sh12b.getText().setText('  AÇÃO IMEDIATA');
  var sh12bs = sh12b.getText().getTextStyle();
  sh12bs.setForegroundColor(C.WHITE); sh12bs.setFontFamily('Poppins'); sh12bs.setFontSize(10); sh12bs.setBold(true);

  escDados.forEach(function(row, r) {
    var altBg = r % 2 === 0 ? '#FFF5F5' : C.WHITE;

    var c0 = tabEsc.getCell(r+1, 0);
    c0.getFill().setSolidFill(altBg);
    c0.getText().setText(row[0]);
    var c0s = c0.getText().getTextStyle();
    c0s.setForegroundColor(C.DARK); c0s.setFontFamily('Inter'); c0s.setFontSize(9);

    var c1 = tabEsc.getCell(r+1, 1);
    c1.getFill().setSolidFill(altBg);
    c1.getText().setText(row[1]);
    var c1s = c1.getText().getTextStyle();
    c1s.setForegroundColor(r === 0 ? C.RED : C.DARK); c1s.setFontFamily('Inter'); c1s.setFontSize(9);
    if (r === 0) c1s.setBold(true);
  });

  // ══════════════════════════════════════════════════════
  // SLIDE 13 — REGRA DE OURO DOS DESCONTOS
  // ══════════════════════════════════════════════════════
  var s13 = adicionarSlide();
  cabecalhoSlide(s13, 'REGRA DE OURO — DESCONTOS', 'Não jogue todas as cartas cedo. A régua resiste.');

  var meses = [
    {label: 'MÊS 1', range: 'D+1–D+30', desc: 'Zero\ndesconto', cor: C.GREEN, nota: 'Quem esquece paga normal'},
    {label: 'MÊS 2', range: 'D+31–D+60', desc: 'Zero\ndesconto', cor: C.GREEN, nota: 'Pressão emocional de perda'},
    {label: 'MÊS 3', range: 'D+61–D+90', desc: '5%\ndesconto', cor: C.AMBER, nota: '1ª carta — boa vontade'},
    {label: 'MÊS 4', range: 'D+91–D+120', desc: '15%\n+ parcela', cor: C.PURPLE, nota: 'Gestor valida parcelamento'},
    {label: 'MÊS 5', range: 'D+121–D+150', desc: '20%\n+ parcela', cor: C.RED, nota: 'Última carta. Não acumula.'},
  ];

  meses.forEach(function(m, i) {
    var mx = 30 + i * 136, my = 72, mw = 128, mh = 240;

    var card = s13.insertShape(SlidesApp.ShapeType.ROUND_RECTANGLE, mx, my, mw, mh);
    card.getFill().setSolidFill(C.OFFWHT);
    card.getBorder().setTransparent();

    var head = s13.insertShape(SlidesApp.ShapeType.ROUND_RECTANGLE, mx, my, mw, 36);
    head.getFill().setSolidFill(m.cor);
    head.getBorder().setTransparent();
    head.getText().setText(m.label);
    var hs = head.getText().getTextStyle();
    hs.setForegroundColor(C.WHITE); hs.setFontFamily('Poppins'); hs.setFontSize(12); hs.setBold(true);
    head.getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);

    txt(s13, m.range, mx, my+42, mw, 18, {cor: C.GRAY, fonte: 'Inter', tam: 9, align: 'center'});

    var descBox = s13.insertShape(SlidesApp.ShapeType.ROUND_RECTANGLE, mx+10, my+66, mw-20, 72);
    descBox.getFill().setSolidFill(m.cor);
    descBox.getBorder().setTransparent();
    descBox.getText().setText(m.desc);
    var ds = descBox.getText().getTextStyle();
    ds.setForegroundColor(C.WHITE); ds.setFontFamily('Poppins'); ds.setFontSize(16); ds.setBold(true);
    descBox.getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);

    txt(s13, m.nota, mx+4, my+148, mw-8, 70, {cor: C.GRAY, fonte: 'Inter', tam: 9, align: 'center'});
  });

  txt(s13, 'Anti-abuso: cada desconto é registrado no CRM. Uma vez usado, não se repete no mesmo mês.', 30, H-30, 660, 22, {cor: C.NAVY, fonte: 'Inter', tam: 10, bold: true, align: 'center'});

  // ══════════════════════════════════════════════════════
  // SLIDE 14 — ENCERRAMENTO
  // ══════════════════════════════════════════════════════
  var s14 = adicionarSlide();
  bg(s14, C.NAVY);

  barra(s14, 0, 5, C.TEAL);
  barra(s14, H-5, 5, C.BLUE);

  var faixaD = s14.insertShape(SlidesApp.ShapeType.RECTANGLE, W-100, 0, 100, H);
  faixaD.getFill().setSolidFill(C.BLUE_D);
  faixaD.getBorder().setTransparent();

  txt(s14, 'Dúvidas?', W/2-200, 110, 400, 60, {cor: C.CYAN, fonte: 'Poppins', tam: 38, bold: true, align: 'center'});
  txt(s14, 'Fale com o Gestor.', W/2-200, 172, 400, 50, {cor: C.WHITE, fonte: 'Inter', tam: 22, align: 'center'});
  txt(s14, 'Plano Mais Assistencial · Projeto Inadimplência · 2026', W/2-250, H-48, 500, 28, {cor: C.LGRAY, fonte: 'Inter', tam: 10, align: 'center'});

  Logger.log('✅ Playbook Humano criado! Acesse: ' + pres.getUrl());
  pres.saveAndClose();
}
