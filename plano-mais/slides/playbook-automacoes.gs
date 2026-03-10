// ============================================================
// PLAYBOOK AUTOMAÇÕES — PROJETO INADIMPLÊNCIA
// Plano Mais Assistencial
//
// COMO USAR:
// 1. Acesse script.google.com
// 2. Crie um novo projeto
// 3. Cole este código
// 4. Clique em "Executar" → criarPlaybookAutomacoes()
// 5. Autorize o acesso quando solicitado
// 6. O Google Slides será criado no seu Drive
// ============================================================

function criarPlaybookAutomacoes() {

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

  var W = 720, H = 405;

  var pres = SlidesApp.create('Playbook Automações — Projeto Inadimplência | Plano Mais');
  var slides = pres.getSlides();

  // ── FUNÇÕES AUXILIARES ─────────────────────────────────

  function limpar(s) {
    s.getShapes().forEach(function(sh) { sh.remove(); });
    s.getTables().forEach(function(t) { t.remove(); });
  }

  function bg(s, cor) { s.getBackground().setSolidFill(cor); }

  function ret(s, x, y, w, h, cor) {
    var r = s.insertShape(SlidesApp.ShapeType.RECTANGLE, x, y, w, h);
    r.getFill().setSolidFill(cor);
    r.getBorder().setTransparent();
    return r;
  }

  function rret(s, x, y, w, h, cor) {
    var r = s.insertShape(SlidesApp.ShapeType.ROUND_RECTANGLE, x, y, w, h);
    if (cor) r.getFill().setSolidFill(cor);
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
    st.setFontSize(opts.tam || 11);
    if (opts.bold) st.setBold(true);
    if (opts.italic) st.setItalic(true);
    var ps = b.getText().getParagraphStyle();
    if (opts.align === 'center') ps.setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);
    if (opts.align === 'end') ps.setParagraphAlignment(SlidesApp.ParagraphAlignment.END);
    return b;
  }

  function caixaTexto(s, titulo, corHead, texto, x, y, w, h) {
    rret(s, x, y, w, h, C.OFFWHT);
    var head = rret(s, x, y, w, 28, corHead);
    head.getText().setText('  ' + titulo);
    var hs = head.getText().getTextStyle();
    hs.setForegroundColor(C.WHITE); hs.setFontFamily('Poppins'); hs.setFontSize(8); hs.setBold(true);
    txt(s, texto, x+10, y+34, w-18, h-40, {cor: C.DARK, fonte: 'Inter', tam: 9});
  }

  function cabecalho(s, titulo, sub) {
    ret(s, 0, 0, W, 54, C.NAVY);
    ret(s, 0, 54, W, 3, C.TEAL);
    txt(s, titulo, 28, 10, 580, 32, {cor: C.WHITE, fonte: 'Poppins', tam: 20, bold: true});
    if (sub) txt(s, sub, 28, 37, 580, 18, {cor: C.CYAN, fonte: 'Inter', tam: 9});
    ret(s, 0, H-4, W, 4, C.BLUE);
  }

  function tagMes(s, label, cor) {
    var tag = rret(s, W-130, 8, 115, 26, cor);
    tag.getText().setText(label);
    var ts = tag.getText().getTextStyle();
    ts.setForegroundColor(C.WHITE); ts.setFontFamily('Poppins'); ts.setFontSize(9); ts.setBold(true);
    tag.getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);
  }

  function pill(s, texto, x, y, w, cor) {
    var p = rret(s, x, y, w, 22, cor);
    p.getText().setText('  ' + texto);
    var ps = p.getText().getTextStyle();
    ps.setForegroundColor(C.WHITE); ps.setFontFamily('Inter'); ps.setFontSize(9); ps.setBold(true);
    return p;
  }

  function novoSlide() {
    var s = pres.appendSlide(SlidesApp.PredefinedLayout.BLANK);
    limpar(s);
    bg(s, C.WHITE);
    return s;
  }

  // ══════════════════════════════════════════════════════
  // SLIDE 1 — CAPA
  // ══════════════════════════════════════════════════════
  var s1 = slides[0];
  limpar(s1);
  bg(s1, C.NAVY);

  ret(s1, 0, 0, W, 5, C.TEAL);
  ret(s1, H-5, 0, W, 5, C.BLUE);
  ret(s1, W-100, 0, 100, H, C.BLUE_D);
  ret(s1, W-105, 0, 8, H, C.TEAL);

  var tp = rret(s1, 60, 80, 240, 24, C.BLUE);
  tp.getText().setText('  PROJETO INADIMPLÊNCIA');
  var tps = tp.getText().getTextStyle();
  tps.setForegroundColor(C.WHITE); tps.setFontFamily('Poppins'); tps.setFontSize(9); tps.setBold(true);

  txt(s1, 'PLAYBOOK DE\nAUTOMAÇÕES', 60, 115, 480, 130, {cor: C.WHITE, fonte: 'Poppins', tam: 50, bold: true});
  txt(s1, 'Manual Técnico dos Processos Automatizados', 62, 258, 480, 30, {cor: C.CYAN, fonte: 'Inter', tam: 16});
  txt(s1, 'n8n · WhatsApp API · LLM · Supabase  ·  2026', 62, H-38, 350, 22, {cor: C.LGRAY, fonte: 'Inter', tam: 10});

  // ══════════════════════════════════════════════════════
  // SLIDE 2 — PRINCÍPIO CENTRAL
  // ══════════════════════════════════════════════════════
  var s2 = novoSlide();
  bg(s2, C.NAVY);
  ret(s2, 0, 0, W, 5, C.TEAL);
  ret(s2, H-5, 0, W, 5, C.BLUE);

  txt(s2, '"Temos 150 dias para recuperar.\nNão gastamos tudo no mês 1."', W/2-280, 70, 560, 120, {cor: C.WHITE, fonte: 'Poppins', tam: 26, bold: true, align: 'center'});

  txt(s2, 'A régua de cobrança é uma escada progressiva de desconto.\nQuem paga cedo não ganha desconto. Quem espera não ganha facilidade.', W/2-280, 210, 560, 60, {cor: C.CYAN, fonte: 'Inter', tam: 14, align: 'center'});

  // Escada visual
  var escadaX = W/2 - 250;
  var escDados = [
    {m: 'M1', d: '0%', c: C.GREEN},
    {m: 'M2', d: '0%', c: C.GREEN},
    {m: 'M3', d: '5%', c: C.AMBER},
    {m: 'M4', d: '15%', c: C.PURPLE},
    {m: 'M5', d: '20%', c: C.RED},
  ];
  escDados.forEach(function(e, i) {
    var ex = escadaX + i * 104, ey = H-52;
    var box = rret(s2, ex, ey, 95, 38, e.c);
    box.getText().setText(e.m + '\n' + e.d);
    var bs = box.getText().getTextStyle();
    bs.setForegroundColor(C.WHITE); bs.setFontFamily('Poppins'); bs.setFontSize(10); bs.setBold(true);
    box.getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);
  });

  // ══════════════════════════════════════════════════════
  // SLIDE 3 — MAPA DOS 5 MESES
  // ══════════════════════════════════════════════════════
  var s3 = novoSlide();
  cabecalho(s3, 'MAPA COMPLETO — 5 MESES DE COBRANÇA', 'Do pré-vencimento ao diagnóstico');

  var fases = [
    {label: 'PRÉ', range: 'D-3 / D-0', desc: 'Lembrete\ngenérico\nSem CRM', cor: C.BLUE},
    {label: 'MÊS 1', range: 'D+1–D+30', desc: 'Recuperação\nsuave\n0% desc.', cor: C.GREEN},
    {label: 'MÊS 2', range: 'D+31–D+60', desc: 'Pressão\nperda\n0% desc.', cor: '#D68910'},
    {label: 'MÊS 3', range: 'D+61–D+90', desc: 'Negociação\n1ª carta\n5% desc.', cor: C.AMBER},
    {label: 'MÊS 4', range: 'D+91–D+120', desc: 'Oferta real\nparcelamento\n15% desc.', cor: C.PURPLE},
    {label: 'MÊS 5', range: 'D+121–D+150', desc: 'Última\nchance\n20% desc.', cor: C.RED},
    {label: 'PÓS', range: 'D+151+', desc: 'Diagnóstico\narquivamento\noutro fluxo', cor: C.GRAY},
  ];

  fases.forEach(function(f, i) {
    var fx = 18 + i * 102, fy = 68, fw = 96, fh = 290;

    var card = rret(s3, fx, fy, fw, fh, C.OFFWHT);
    var head = rret(s3, fx, fy, fw, 36, f.cor);
    head.getText().setText(f.label);
    var hs = head.getText().getTextStyle();
    hs.setForegroundColor(C.WHITE); hs.setFontFamily('Poppins'); hs.setFontSize(10); hs.setBold(true);
    head.getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);

    txt(s3, f.range, fx, fy+40, fw, 18, {cor: f.cor, fonte: 'Inter', tam: 8, bold: true, align: 'center'});
    txt(s3, f.desc, fx+4, fy+62, fw-8, 80, {cor: C.DARK, fonte: 'Inter', tam: 9, align: 'center'});

    // Seta entre fases
    if (i < fases.length - 1) {
      var arrow = s3.insertShape(SlidesApp.ShapeType.RIGHT_ARROW, fx+fw-2, fy+fh/2-8, 10, 16);
      arrow.getFill().setSolidFill(C.LGRAY);
      arrow.getBorder().setTransparent();
    }
  });

  txt(s3, 'Pagamento confirmado em qualquer fase → encerrar fluxo imediatamente.', 18, H-30, 684, 22, {cor: C.BLUE, fonte: 'Inter', tam: 9, bold: true, align: 'center'});

  // ══════════════════════════════════════════════════════
  // SLIDE 4 — FASE 0 — PRÉ-VENCIMENTO
  // ══════════════════════════════════════════════════════
  var s4 = novoSlide();
  cabecalho(s4, 'FASE 0 — PRÉ-VENCIMENTO', 'D-3 e D-0 · Sem personalização CRM · Tom de serviço');
  tagMes(s4, 'D-3  /  D-0', C.BLUE);

  pill(s4, 'Personalização CRM: DESATIVADA', 30, 72, 200, C.GRAY);
  pill(s4, 'Desconto: NENHUM', 242, 72, 140, C.GRAY);

  var motivo = rret(s4, 30, 100, 310, 100, C.OFFWHT);
  var mHead = rret(s4, 30, 100, 310, 26, C.NAVY);
  mHead.getText().setText('  POR QUE SEM PERSONALIZAÇÃO?');
  var mhs = mHead.getText().getTextStyle();
  mhs.setForegroundColor(C.WHITE); mhs.setFontFamily('Poppins'); mhs.setFontSize(8); mhs.setBold(true);
  txt(s4, 'O cliente ainda não deve nada.\nUsar dados pessoais antes do vencimento\npode soar invasivo.\nPersonalização entra só após o atraso.', 40, 130, 292, 65, {cor: C.DARK, fonte: 'Inter', tam: 9});

  caixaTexto(s4, 'MENSAGEM D-3 (3 dias antes)', C.BLUE,
    'Oi, [NOME]!\n\nSó um lembrete: sua mensalidade do\nPlano Mais vence em 3 dias (dia [DATA]).\n\n→ [BOTÃO: Pagar agora]\n→ [BOTÃO: Ver meu plano]\n\nQualquer dúvida, é só falar 💙',
    356, 68, 334, 170);

  caixaTexto(s4, 'MENSAGEM D-0 (dia do vencimento)', C.TEAL,
    '[NOME], hoje é o vencimento\nda sua mensalidade Plano Mais.\n\nMantenha seus benefícios ativos:\n\n→ [BOTÃO: Pagar via PIX]\n→ [BOTÃO: Pagar com Cartão]\n→ [BOTÃO: Gerar boleto]',
    356, 248, 334, 120);

  txt(s4, 'Lead paga → encerrar. Lead não paga → Mês 1 começa após 24h automaticamente.', 30, H-30, 660, 22, {cor: C.BLUE, fonte: 'Inter', tam: 9, bold: true, align: 'center'});

  // ══════════════════════════════════════════════════════
  // SLIDE 5 — MÊS 1
  // ══════════════════════════════════════════════════════
  var s5 = novoSlide();
  cabecalho(s5, 'MÊS 1 — RECUPERAÇÃO SUAVE', 'D+1 a D+30 · Agente IA protagonista · CRM ativo');
  tagMes(s5, 'D+1 A D+30', C.GREEN);

  pill(s5, '0% de desconto', 30, 72, 120, C.GREEN);
  pill(s5, 'CRM: ATIVO', 162, 72, 100, C.BLUE);

  // Régua de disparos
  var tabM1 = s5.insertTable(6, 3, 30, 100, 340, 260);

  var m1Headers = ['DIA', 'TIPO', 'CONTEÚDO'];
  m1Headers.forEach(function(h, c) {
    var cell = tabM1.getCell(0, c);
    cell.getFill().setSolidFill(C.NAVY);
    cell.getText().setText(h);
    var cs = cell.getText().getTextStyle();
    cs.setForegroundColor(C.WHITE); cs.setFontFamily('Poppins'); cs.setFontSize(8); cs.setBold(true);
    cell.getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);
  });

  var m1Dados = [
    ['D+1', 'Texto + botões', 'Lembrete + link'],
    ['D+3', 'Texto', '"Aconteceu algo?"'],
    ['D+7', 'Texto + CRM', 'Benefícios personalizados'],
    ['D+15', 'Texto', '"Benefícios suspensos"'],
    ['D+25', 'Texto', 'Último contato do mês'],
  ];

  m1Dados.forEach(function(row, r) {
    row.forEach(function(ct, c) {
      var cell = tabM1.getCell(r+1, c);
      cell.getFill().setSolidFill(r % 2 === 0 ? C.OFFWHT : C.WHITE);
      cell.getText().setText(ct);
      var cs = cell.getText().getTextStyle();
      cs.setForegroundColor(C.DARK); cs.setFontFamily('Inter'); cs.setFontSize(8);
      cell.getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);
    });
  });

  // Árvore de decisão resumida
  txt(s5, 'ÁRVORE DE DECISÃO', 390, 100, 300, 18, {cor: C.NAVY, fonte: 'Poppins', tam: 10, bold: true});

  var arvore = [
    {r: '"Vou pagar"', a: 'Enviar link + verificar 24h', c: C.GREEN},
    {r: '"Sem dinheiro"', a: 'Perguntar data + registrar FINANCEIRO', c: C.AMBER},
    {r: '"Não uso"', a: 'Script benefícios → escalar se persiste', c: C.PURPLE},
    {r: '"Cancelar"', a: '🔴 URGENTE → atendente imediato', c: C.RED},
    {r: 'Sem resposta', a: 'Próximo disparo da régua', c: C.GRAY},
  ];

  arvore.forEach(function(a, i) {
    var ay = 124 + i * 46;
    var rBox = rret(s5, 390, ay, 120, 36, C.OFFWHT);
    var dotR = s5.insertShape(SlidesApp.ShapeType.ELLIPSE, 392, ay+14, 8, 8);
    dotR.getFill().setSolidFill(a.c); dotR.getBorder().setTransparent();
    txt(s5, a.r, 405, ay+8, 104, 22, {cor: C.DARK, fonte: 'Inter', tam: 8});

    var arrow = s5.insertShape(SlidesApp.ShapeType.RIGHT_ARROW, 514, ay+12, 14, 12);
    arrow.getFill().setSolidFill(a.c); arrow.getBorder().setTransparent();

    txt(s5, a.a, 532, ay+6, 178, 28, {cor: a.c === C.RED ? C.RED : C.DARK, fonte: 'Inter', tam: 8, bold: a.c === C.RED});
  });

  // ══════════════════════════════════════════════════════
  // SLIDE 6 — MÊS 2
  // ══════════════════════════════════════════════════════
  var s6 = novoSlide();
  cabecalho(s6, 'MÊS 2 — PRESSÃO', 'D+31 a D+60 · Custo emocional da perda · Cálculo automático');
  tagMes(s6, 'D+31 A D+60', C.AMBER);

  pill(s6, '0% de desconto', 30, 72, 120, C.AMBER);
  pill(s6, 'CRM: ATIVO', 162, 72, 100, C.BLUE);

  var tabM2 = s6.insertTable(5, 3, 30, 100, 340, 220);
  var m2H = ['DIA', 'TIPO', 'CONTEÚDO'];
  m2H.forEach(function(h, c) {
    var cell = tabM2.getCell(0, c);
    cell.getFill().setSolidFill(C.AMBER);
    cell.getText().setText(h);
    var cs = cell.getText().getTextStyle();
    cs.setForegroundColor(C.WHITE); cs.setFontFamily('Poppins'); cs.setFontSize(8); cs.setBold(true);
    cell.getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);
  });

  var m2D = [
    ['D+31', 'Texto', '"Já é o 2° mês"'],
    ['D+40', 'Texto + imagem', 'Visual dos benefícios perdidos'],
    ['D+50', 'Texto', 'Cálculo do que perdeu (R$X)'],
    ['D+60', 'Texto', 'Última msg do mês'],
  ];
  m2D.forEach(function(row, r) {
    row.forEach(function(ct, c) {
      var cell = tabM2.getCell(r+1, c);
      cell.getFill().setSolidFill(r % 2 === 0 ? C.OFFWHT : C.WHITE);
      cell.getText().setText(ct);
      var cs = cell.getText().getTextStyle();
      cs.setForegroundColor(C.DARK); cs.setFontFamily('Inter'); cs.setFontSize(8);
      cell.getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);
    });
  });

  caixaTexto(s6, 'CÁLCULO DE PERDA — D+50 (gerado pelo sistema)', C.AMBER,
    '"[NOME], em 60 dias sem o Plano Mais você\ndeixou de ter acesso a benefícios que valem\naté R$[VALOR_ESTIMADO].\n\nSó a consulta médica na SupraMed custa\nR$80 particular. Seu plano dá 2 por mês.\n\nRegularizar agora custa apenas R$[MENSALIDADE]."\n\n→ [BOTÃO: Pagar agora]',
    386, 68, 304, 230);

  txt(s6, 'Diferencial do D+50: o sistema calcula automaticamente com base no plano e dias de atraso.', 30, H-30, 660, 22, {cor: C.AMBER, fonte: 'Inter', tam: 9, bold: true, align: 'center'});

  // ══════════════════════════════════════════════════════
  // SLIDE 7 — MÊS 3
  // ══════════════════════════════════════════════════════
  var s7 = novoSlide();
  cabecalho(s7, 'MÊS 3 — NEGOCIAÇÃO', 'D+61 a D+90 · 1ª carta jogada · Desconto simbólico 5%');
  tagMes(s7, 'D+61 A D+90', C.PURPLE);

  pill(s7, 'Desconto: 5%', 30, 72, 110, C.PURPLE);
  pill(s7, 'Validade: 48h', 152, 72, 110, C.NAVY);
  pill(s7, 'Anti-abuso ativo', 274, 72, 120, C.RED);

  var tabM3 = s7.insertTable(5, 3, 30, 100, 340, 220);
  var m3H = ['DIA', 'TIPO', 'CONTEÚDO'];
  m3H.forEach(function(h, c) {
    var cell = tabM3.getCell(0, c);
    cell.getFill().setSolidFill(C.PURPLE);
    cell.getText().setText(h);
    var cs = cell.getText().getTextStyle();
    cs.setForegroundColor(C.WHITE); cs.setFontFamily('Poppins'); cs.setFontSize(8); cs.setBold(true);
    cell.getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);
  });

  var m3D = [
    ['D+61', 'Texto', '"Queremos te ajudar a voltar"'],
    ['D+75', 'Texto + oferta', '5% desconto · válido 48h'],
    ['D+85', 'Texto', 'Reforço com prazo'],
    ['D+90', 'Texto', '"Oferta expirada. Próximo mês muda."'],
  ];
  m3D.forEach(function(row, r) {
    row.forEach(function(ct, c) {
      var cell = tabM3.getCell(r+1, c);
      cell.getFill().setSolidFill(r === 1 ? '#F3E8FF' : r % 2 === 0 ? C.OFFWHT : C.WHITE);
      cell.getText().setText(ct);
      var cs = cell.getText().getTextStyle();
      cs.setForegroundColor(r === 1 ? C.PURPLE : C.DARK); cs.setFontFamily('Inter'); cs.setFontSize(8);
      if (r === 1) cs.setBold(true);
      cell.getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);
    });
  });

  caixaTexto(s7, 'MENSAGEM D+75 — OFERTA DE 5%', C.PURPLE,
    '"[NOME], já são 75 dias. Queremos te ver de volta.\n\nPor isso oferecemos 5% de desconto\npara regularizar hoje.\n\nVocê paga R$[VALOR_COM_DESCONTO]\nem vez de R$[VALOR_NORMAL].\n\nOferta válida por 48 horas.\n\n→ [BOTÃO: Aceitar e pagar]\n→ [BOTÃO: Tenho dúvidas]"',
    386, 68, 304, 250);

  var antiAbuso = rret(s7, 30, H-48, 340, 36, '#F3E8FF');
  txt(s7, 'ANTI-ABUSO: Desconto registrado em descontos_concedidos.\nSe já usou → sistema bloqueia automaticamente.', 40, H-44, 322, 30, {cor: C.PURPLE, fonte: 'Inter', tam: 8, bold: true});

  // ══════════════════════════════════════════════════════
  // SLIDE 8 — MÊS 4
  // ══════════════════════════════════════════════════════
  var s8 = novoSlide();
  cabecalho(s8, 'MÊS 4 — OFERTA REAL', 'D+91 a D+120 · Atendente protagonista · 15% + parcelamento');
  tagMes(s8, 'D+91 A D+120', C.BLUE_D);

  pill(s8, 'Desconto: 15%', 30, 72, 115, C.BLUE_D);
  pill(s8, 'Parcelas: até 3x', 157, 72, 120, C.PURPLE);
  pill(s8, 'Atendente: PROTAGONISTA', 289, 72, 180, C.RED);

  var tabM4 = s8.insertTable(6, 3, 30, 100, 340, 260);
  var m4H = ['DIA', 'TIPO', 'RESPONSÁVEL'];
  m4H.forEach(function(h, c) {
    var cell = tabM4.getCell(0, c);
    cell.getFill().setSolidFill(C.BLUE_D);
    cell.getText().setText(h);
    var cs = cell.getText().getTextStyle();
    cs.setForegroundColor(C.WHITE); cs.setFontFamily('Poppins'); cs.setFontSize(8); cs.setBold(true);
    cell.getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);
  });

  var m4D = [
    ['D+91', '"Já é o 4° mês"', 'Agente IA'],
    ['D+100', 'Oferta 15% + parcela', 'Agente IA'],
    ['D+110', 'Liga ou áudio pessoal', 'Atendente A'],
    ['D+120', '"Último mês se aproxima"', 'Agente IA'],
  ];
  m4D.forEach(function(row, r) {
    row.forEach(function(ct, c) {
      var cell = tabM4.getCell(r+1, c);
      var isHuman = row[2] === 'Atendente A';
      cell.getFill().setSolidFill(isHuman ? '#EFF6FF' : r % 2 === 0 ? C.OFFWHT : C.WHITE);
      cell.getText().setText(ct);
      var cs = cell.getText().getTextStyle();
      cs.setForegroundColor(isHuman && c === 2 ? C.BLUE : C.DARK);
      cs.setFontFamily('Inter'); cs.setFontSize(8);
      if (isHuman && c === 2) cs.setBold(true);
      cell.getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);
    });
  });

  caixaTexto(s8, 'REGRAS DO PARCELAMENTO', C.BLUE_D,
    'Dívida até 3 meses → parcelar em 2x sem juros\nDívida de 4 meses  → parcelar em 3x sem juros\n15% de desconto aplicado sobre o total\n\nParcelamento > 3x → gerar link de pagamento\npara o valor total com desconto aplicado.\n\nAprovação via atendente — não automático.',
    386, 68, 304, 200);

  var aviso4 = rret(s8, 386, 276, 304, 48, '#FEF2F2');
  txt(s8, 'Atendente D+110: ligar ou enviar áudio pessoal.\nLeads Platinum/Premium → Gestor assume.', 396, 282, 288, 36, {cor: C.RED, fonte: 'Inter', tam: 9, bold: true});

  // ══════════════════════════════════════════════════════
  // SLIDE 9 — MÊS 5
  // ══════════════════════════════════════════════════════
  var s9 = novoSlide();
  cabecalho(s9, 'MÊS 5 — ÚLTIMA CHANCE', 'D+121 a D+150 · Melhor oferta · Sem acúmulo de desconto');
  tagMes(s9, 'D+121 A D+150', C.RED);

  pill(s9, 'Desconto final: 20%', 30, 72, 150, C.RED);
  pill(s9, 'Não acumula', 192, 72, 110, C.GRAY);
  pill(s9, 'Atendente sênior', 314, 72, 130, C.NAVY);

  var tabM5 = s9.insertTable(6, 3, 30, 100, 340, 260);
  var m5H = ['DIA', 'AÇÃO', 'RESPONSÁVEL'];
  m5H.forEach(function(h, c) {
    var cell = tabM5.getCell(0, c);
    cell.getFill().setSolidFill(C.RED);
    cell.getText().setText(h);
    var cs = cell.getText().getTextStyle();
    cs.setForegroundColor(C.WHITE); cs.setFontFamily('Poppins'); cs.setFontSize(8); cs.setBold(true);
    cell.getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);
  });

  var m5D = [
    ['D+121', '"Último mês ativo"', 'Agente IA'],
    ['D+130', 'Oferta final 20%', 'Agente IA'],
    ['D+140', 'Proposta pessoal final', 'Atendente sênior'],
    ['D+148', '"Encerra em 2 dias"', 'Agente IA'],
    ['D+150', 'Encerrar contrato', 'Sistema automático'],
  ];
  m5D.forEach(function(row, r) {
    row.forEach(function(ct, c) {
      var isSys = row[0] === 'D+150';
      cell = tabM5.getCell(r+1, c);
      cell.getFill().setSolidFill(isSys ? '#FEF2F2' : r % 2 === 0 ? C.OFFWHT : C.WHITE);
      cell.getText().setText(ct);
      var cs = cell.getText().getTextStyle();
      cs.setForegroundColor(isSys ? C.RED : C.DARK);
      cs.setFontFamily('Inter'); cs.setFontSize(8);
      if (isSys) cs.setBold(true);
      cell.getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);
    });
  });

  caixaTexto(s9, 'OFERTA FINAL — D+130', C.RED,
    '"[NOME], chegamos ao último mês.\n\nNossa melhor oferta:\n✓ 20% de desconto no total\n✓ Parcele em até 3x sem juros\n✓ Plano reativa após 1ª parcela\n\nEssa oferta expira em [DATA — 10 dias].\n\n→ [BOTÃO: Quero regularizar]\n→ [BOTÃO: Falar com atendente]\n→ [BOTÃO: Encerrar meu plano]"',
    386, 68, 304, 292);

  // ══════════════════════════════════════════════════════
  // SLIDE 10 — PÓS D+150
  // ══════════════════════════════════════════════════════
  var s10 = novoSlide();
  cabecalho(s10, 'PÓS D+150 — DIAGNÓSTICO', 'Não é cobrança. É entendimento. Pode virar reativação futura.');

  pill(s10, 'Sem desconto', 30, 72, 110, C.GRAY);
  pill(s10, 'Sem pressão', 152, 72, 100, C.GRAY);
  pill(s10, 'Sem julgamento', 264, 72, 120, C.GRAY);

  caixaTexto(s10, 'MENSAGEM DE ENCERRAMENTO', C.NAVY,
    '"[NOME], seu Plano Mais foi encerrado hoje.\n\nGuardaremos seu histórico com carinho\ncaso queira voltar algum dia.\n\nUma última pergunta:\nO que aconteceu que te impediu de continuar?\n\nResponda com o número:\n1 - Financeiro\n2 - Mudei de cidade\n3 - Não estava usando\n4 - Encontrei outra opção\n5 - Outro motivo"',
    30, 100, 320, 260);

  txt(s10, 'FLUXO PÓS-RESPOSTA', 370, 100, 320, 18, {cor: C.NAVY, fonte: 'Poppins', tam: 10, bold: true});

  var fluxos = [
    {r: '1 - Financeiro', a: 'Tag: FINANCEIRO_CRITICO\nRevisitar: 45 dias', c: C.AMBER},
    {r: '2 - Mudou de cidade', a: 'Tag: FORA_REGIAO\nNunca mais contatar', c: C.GRAY},
    {r: '3 - Não usava', a: 'Tag: INSATISFEITO\nEnviar pesquisa NPS', c: C.PURPLE},
    {r: '4 - Concorrente', a: 'Tag: CONCORRENTE\nDado p/ time comercial', c: C.BLUE},
    {r: '5 ou Sem resposta', a: 'Tag: INATIVO_SEM_MOTIVO\nRevisitar: 45 dias', c: C.DARK},
    {r: 'Quer voltar depois', a: 'Tag: POTENCIAL_RETORNO\nRevisitar: 30 dias', c: C.GREEN},
  ];

  fluxos.forEach(function(f, i) {
    var fx = 370 + (i % 2) * 172;
    var fy = 124 + Math.floor(i/2) * 82;
    var fBox = rret(s10, fx, fy, 162, 70, C.OFFWHT);
    var fHead = rret(s10, fx, fy, 162, 24, f.c);
    fHead.getText().setText(f.r);
    var fhs = fHead.getText().getTextStyle();
    fhs.setForegroundColor(C.WHITE); fhs.setFontFamily('Inter'); fhs.setFontSize(7.5); fhs.setBold(true);
    txt(s10, f.a, fx+6, fy+28, 150, 38, {cor: C.DARK, fonte: 'Inter', tam: 8});
  });

  // ══════════════════════════════════════════════════════
  // SLIDE 11 — 6 WORKFLOWS n8n
  // ══════════════════════════════════════════════════════
  var s11 = novoSlide();
  cabecalho(s11, '6 WORKFLOWS n8n', 'Estrutura técnica da automação');

  var workflows = [
    {n: 'WF 1', t: 'Scheduler Diário', d: 'Roda às 08:00\nCalcula dias_atraso\nDistribui para os demais WF', c: C.NAVY},
    {n: 'WF 2', t: 'Disparo por Fase', d: 'Monta contexto do lead\nPersonaliza mensagem\nDispara via API WhatsApp', c: C.BLUE},
    {n: 'WF 3', t: 'Agente Conversacional', d: 'Recebe respostas\nDetecta intenção (LLM)\nÁrvore de decisão', c: C.PURPLE},
    {n: 'WF 4', t: 'Receptor de Pagamentos', d: 'Webhook API Avante\nAtualiza lead no banco\nNotifica dashboard', c: C.GREEN},
    {n: 'WF 5', t: 'Campanhas Manuais', d: 'Segmentação por filtros\nIA personaliza texto\nDisparo em lotes (50/vez)', c: C.AMBER},
    {n: 'WF 6', t: 'Diagnóstico Pós-D150', d: 'Encerra contrato\nColeta motivo\nAplica tag de arquivamento', c: C.GRAY},
  ];

  workflows.forEach(function(wf, i) {
    var wx = 18 + (i % 3) * 234;
    var wy = 70 + Math.floor(i/3) * 160;
    var ww = 220, wh = 148;

    var card = rret(s11, wx, wy, ww, wh, C.OFFWHT);
    var head = rret(s11, wx, wy, ww, 42, wf.c);

    txt(s11, wf.n, wx+10, wy+4, 50, 16, {cor: C.WHITE, fonte: 'Poppins', tam: 9, bold: true});
    txt(s11, wf.t, wx+10, wy+20, ww-20, 20, {cor: C.WHITE, fonte: 'Poppins', tam: 10, bold: true});
    txt(s11, wf.d, wx+10, wy+50, ww-18, 90, {cor: C.DARK, fonte: 'Inter', tam: 9});
  });

  // ══════════════════════════════════════════════════════
  // SLIDE 12 — BANCO DE DADOS
  // ══════════════════════════════════════════════════════
  var s12 = novoSlide();
  cabecalho(s12, 'BANCO DE DADOS — SUPABASE', 'Tabelas principais do sistema');

  var tabelas = [
    {
      nome: 'leads', cor: C.NAVY,
      campos: ['id, nome, telefone, email, cpf', 'plano, valor_mensalidade, data_vencimento', 'status, dias_atraso, valor_em_aberto', 'tem_pet, tem_dependentes, num_dependentes', 'idade, cidade, bairro', 'motivo_arquivamento, tag_arquivamento', 'data_entrada, ultima_interacao']
    },
    {
      nome: 'conversas + mensagens', cor: C.BLUE,
      campos: ['id, lead_id, tipo (BOT/HUMANO)', 'inicio, fim, status, atendente_id', '─────', 'mensagem: id, conversa_id', 'remetente, conteudo, tipo', 'timestamp, status_entrega']
    },
    {
      nome: 'descontos_concedidos', cor: C.PURPLE,
      campos: ['id, lead_id', 'percentual, tipo (MES3/MES4/MES5)', 'data_concessao, utilizado (bool)', 'aprovado_por']
    },
    {
      nome: 'campanhas + resultados', cor: C.AMBER,
      campos: ['campanha: id, nome, filtros (JSON)', 'template, midia, agendado_para', 'resultado: campanha_id, lead_id', 'enviado, lido, respondeu, pagou']
    },
  ];

  tabelas.forEach(function(t, i) {
    var tx = 18 + (i % 2) * 350;
    var ty = 68 + Math.floor(i/2) * 168;
    var tw = 336, th = 158;

    rret(s12, tx, ty, tw, th, C.OFFWHT);
    var thead = rret(s12, tx, ty, tw, 26, t.cor);
    thead.getText().setText('  ' + t.nome.toUpperCase());
    var ts = thead.getText().getTextStyle();
    ts.setForegroundColor(C.WHITE); ts.setFontFamily('Poppins'); ts.setFontSize(9); ts.setBold(true);

    t.campos.forEach(function(campo, c) {
      var isDivider = campo === '─────';
      txt(s12, isDivider ? campo : '· ' + campo, tx+8, ty+30+c*18, tw-16, 16, {
        cor: isDivider ? C.LGRAY : C.DARK, fonte: 'Inter', tam: 8
      });
    });
  });

  txt(s12, 'custos_operacionais: data, tipo, quantidade, custo_unitario, custo_total, campanha_id', 18, H-26, 684, 18, {cor: C.GRAY, fonte: 'Inter', tam: 8, italic: true, align: 'center'});

  // ══════════════════════════════════════════════════════
  // SLIDE 13 — CAPA FINAL
  // ══════════════════════════════════════════════════════
  var s13 = novoSlide();
  bg(s13, C.NAVY);
  ret(s13, 0, 0, W, 5, C.TEAL);
  ret(s13, H-5, 0, W, 5, C.BLUE);
  ret(s13, W-100, 0, 100, H, C.BLUE_D);
  ret(s13, W-105, 0, 8, H, C.TEAL);

  txt(s13, 'Pronto para\nautomatizar.', W/2-250, 90, 500, 130, {cor: C.WHITE, fonte: 'Poppins', tam: 44, bold: true, align: 'center'});
  txt(s13, 'n8n · WhatsApp · LLM · Supabase · Dashboard', W/2-250, 240, 500, 34, {cor: C.CYAN, fonte: 'Inter', tam: 16, align: 'center'});
  txt(s13, 'Plano Mais Assistencial  ·  Projeto Inadimplência  ·  2026', W/2-220, H-44, 440, 24, {cor: C.LGRAY, fonte: 'Inter', tam: 10, align: 'center'});

  Logger.log('✅ Playbook Automações criado! Acesse: ' + pres.getUrl());
  pres.saveAndClose();
}
