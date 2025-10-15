export interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  author: string
  date: string
  category: string
  image: string
  readTime: string
}

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    slug: 'Abono-Salarial',
    title: 'Abono Salarial: Entenda Seus Direitos e as Regras Atuais',
    excerpt: 'Entenda Seus Direitos e as Regras Atuais Relacionados ao Abono Salarial',
    content: `
      <p style="text-align: justify;">O abono salarial é um dos benefícios mais importantes garantidos aos trabalhadores brasileiros. Trata-se de um valor pago anualmente a quem se enquadra em determinados critérios legais, funcionando como uma espécie de 14º salário para quem recebe até dois salários mínimos mensais em média.
<br><br>Com as mudanças constantes na legislação trabalhista e na forma de organização dos pagamentos, é fundamental compreender as regras atuais, quem tem direito, como consultar e o que fazer em caso de dúvidas.
<br><br><strong>O que é o Abono Salarial?</strong><br><br>
O abono salarial é um benefício previsto na Constituição Federal e regulamentado pela Lei nº 7.998/1990, sendo pago com recursos do FAT (Fundo de Amparo ao Trabalhador). O valor pode chegar a até um salário mínimo vigente no ano do pagamento.
<br><br>
Em 2025, o valor do abono segue a lógica proporcional: o trabalhador recebe conforme os meses trabalhados no ano-base, sendo necessário mínimo de 30 dias de vínculo formal.
<br><br>
<strong>Quem tem direito ao Abono Salarial?
</strong><br><br>

Para receber, o trabalhador precisa cumprir os seguintes requisitos:<br>
🔹Estar cadastrado no PIS/PASEP há pelo menos 5 anos;<br>
🔹Ter trabalhado formalmente por pelo menos 30 dias no ano-base considerado;<br>
🔹Ter recebido até 2 salários mínimos de média mensal durante o período;<br>
🔹Ter seus dados corretamente informados pelo empregador na RAIS/eSocial.<br><br>

Importante: quem trabalhou menos de 12 meses também tem direito, mas o valor será proporcional.<br><br>

<strong>Como consultar se você tem direito?</strong><br><br>

O trabalhador pode verificar a disponibilidade do abono por meio:<br>

&nbsp;&nbsp;&nbsp;&nbsp;1. Do aplicativo Carteira de Trabalho Digital;<br>
&nbsp;&nbsp;&nbsp;&nbsp;2. Do aplicativo Caixa Tem (para PIS);<br>
&nbsp;&nbsp;&nbsp;&nbsp;3. Do aplicativo Banco do Brasil (para PASEP);<br>
&nbsp;&nbsp;&nbsp;&nbsp;4. Pelo site ou aplicativo Gov.br.<br><br>

<strong>Calendário de Pagamento</strong><br><br>


Atualmente, o abono salarial é pago no ano seguinte ao trabalhado. Por exemplo, em 2025 está sendo pago o abono referente ao ano-base 2023.


 O calendário é definido pelo governo federal e divulgado anualmente.<br><br>
<strong>
O que fazer em caso de dúvidas ou problemas?</strong><br><br>

Se você acredita que tem direito ao abono salarial, mas não recebeu, ou se encontrou erros nos seus dados cadastrais, é fundamental procurar auxílio. Muitas vezes, o problema está relacionado a informações incorretas enviadas pelo empregador no eSocial ou RAIS.
<br><br>
Nesses casos, o ideal é:<br>
🔹Conferir suas informações nos canais oficiais;<br>
🔹Procurar o setor de RH ou contabilidade da empresa onde trabalhou;<br>
🔹Buscar orientação de um advogado trabalhista, que poderá analisar sua situação e indicar os caminhos legais para garantir o recebimento.
<br><br>
<strong>Considerações finais</strong>
<br><br>
O abono salarial é um direito importante que complementa a renda de milhões de trabalhadores brasileiros. No entanto, é comum surgirem dúvidas sobre valores, prazos e requisitos. Por isso, nunca deixe de buscar informações e, sempre que necessário, conte com a orientação de um advogado para garantir seus direitos.
<br><br>
🔎 Gostou deste conteúdo? Continue acompanhando nosso blog para mais informações sobre seus direitos.</p>
    `,
    author: 'Osmar Neves',
    date: '2025-06-15',
    category: 'Direito Trabalhista',
    image: 'https://www.cut.org.br/img/cache/ogimage/system/uploads/news/21db40a52156e048f03f5e33e6fdf044/cover/abono-salarial-arte-mte.png',
    readTime: '5 min',
  },
  {
    id: 2,
    slug: 'divorcio-consensual-litigioso',
    title: 'Divórcio Consensual vs Litigioso: Entenda as Diferenças',
    excerpt: 'Saiba qual é a melhor opção para o seu caso e como cada tipo de divórcio funciona na prática.',
    content: `
      <p>O divórcio é um momento delicado e entender as opções disponíveis pode facilitar o processo. Existem duas modalidades principais: consensual e litigioso.</p>
      
      <h3>Divórcio Consensual</h3>
      <p>Ocorre quando o casal está de acordo sobre todos os aspectos da separação, incluindo partilha de bens, guarda dos filhos e pensão alimentícia. É mais rápido e menos oneroso.</p>
      
      <h4>Vantagens:</h4>
      <ul>
        <li>Processo mais rápido</li>
        <li>Menor custo</li>
        <li>Menos desgaste emocional</li>
        <li>Pode ser feito em cartório (se não houver filhos menores)</li>
      </ul>
      
      <h3>Divórcio Litigioso</h3>
      <p>Acontece quando há discordância entre o casal sobre algum aspecto da separação. Neste caso, é necessário processo judicial.</p>
      
      <h4>Quando é necessário:</h4>
      <ul>
        <li>Desacordo sobre partilha de bens</li>
        <li>Disputa pela guarda dos filhos</li>
        <li>Divergência sobre pensão alimentícia</li>
        <li>Quando um dos cônjuges não aceita o divórcio</li>
      </ul>
      
      <h3>Documentação Necessária</h3>
      <p>Independente do tipo, você precisará de: certidão de casamento, documentos pessoais, comprovante de residência, e documentos dos filhos (se houver).</p>
      
      <p>Nossa equipe especializada em Direito de Família pode orientar você em todas as etapas do processo. Agende uma consulta!</p>
    `,
    author: 'Jonatas Costa',
    date: '2024-06-30',
    category: 'Direito de Família',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800',
    readTime: '7 min',
  },
  {
    id: 3,
    slug: 'usucapiao-como-funciona',
    title: 'Usucapião: Como Funciona e Quem Tem Direito',
    excerpt: 'Entenda o que é usucapião, os requisitos necessários e como dar entrada no processo.',
    content: `
      <p>A usucapião é uma forma de aquisição de propriedade através da posse prolongada de um imóvel. É um direito garantido pelo Código Civil brasileiro.</p>
      
      <h3>O que é Usucapião?</h3>
      <p>É o direito de se tornar proprietário de um bem móvel ou imóvel através da posse contínua e pacífica por determinado período de tempo.</p>
      
      <h3>Tipos de Usucapião</h3>
      
      <h4>1. Usucapião Extraordinária</h4>
      <p>Requisitos: posse mansa, pacífica e ininterrupta por 15 anos, sem necessidade de justo título ou boa-fé. O prazo reduz para 10 anos se houver moradia habitual ou obras produtivas.</p>
      
      <h4>2. Usucapião Ordinária</h4>
      <p>Requisitos: posse de 10 anos com justo título e boa-fé. Reduz para 5 anos se o imóvel foi adquirido onerosamente e há moradia ou investimentos.</p>
      
      <h4>3. Usucapião Especial Urbana</h4>
      <p>Para imóveis urbanos de até 250m², com posse de 5 anos, sendo utilizado como moradia e sem outro imóvel.</p>
      
      <h4>4. Usucapião Especial Rural</h4>
      <p>Para áreas rurais de até 50 hectares, com posse de 5 anos, tornando a terra produtiva e sendo a única propriedade.</p>
      
      <h3>Documentação Necessária</h3>
      <ul>
        <li>Comprovantes de posse (contas de luz, água, IPTU)</li>
        <li>Testemunhas</li>
        <li>Planta e memorial descritivo do imóvel</li>
        <li>Certidões negativas</li>
      </ul>
      
      <p>O processo de usucapião pode ser complexo. Conte com nossa assessoria especializada para garantir seus direitos!</p>
    `,
    author: 'Jonatas Costa',
    date: '2024-01-05',
    category: 'Direito Imobiliário',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
    readTime: '6 min',
  },
  {
    id: 4,
    slug: 'Pensao-Alimenticia',
    title: 'Pensão Alimentícia',
    excerpt: 'Pensão Alimentícia: o que você precisa saber hoje (e quando consultar um advogado)',
    content: `
      <p style="text-align: justify;">A pensão alimentícia é um tema muito presente no cotidiano das famílias, e envolve tanto aspectos emocionais quanto legais. A ideia deste texto é explicar de forma simples, clara e atualizada o que ela significa, como funciona, o que mudou recentemente e quando é indispensável procurar um advogado para resolver dúvidas ou litígios. Vamos lá?
<strong><br><br>
1. O que é pensão alimentícia?</strong><br><br>

Em linhas gerais, pensão alimentícia é uma obrigação legal de uma pessoa (o “alimentante”) de prover recursos financeiros ou outros meios para que outra (o “alimentando”) possa suprir suas necessidades básicas, como alimentação, moradia, educação, saúde, vestuário etc.
<br><br>
Não se trata apenas de “dar comida”, é garantir um padrão de vida compatível com a condição social de quem recebe, levando em conta suas necessidades e as possibilidades de quem paga. No Brasil, a pensão alimentícia está prevista nos artigos 1.694 a 1.710 do Código Civil. Também há uma lei específica (Lei de Alimentos, Lei n.º 5.478/1968) que regula o procedimento de ação de alimentos.
<strong><br><br>
2. Quem pode pedir e quem pode ser obrigado a pagar?</strong><br><br>

&nbsp;&nbsp;&nbsp; 2.1 Legitimados para pedir pensão<br><br>

Podem requerer pensão alimentícia:<br>

&nbsp;&nbsp;&nbsp;* Filhos menores de idade ou incapazes (ou maiores que comprovem dependência)<br>

&nbsp;&nbsp;&nbsp;* Ex-cônjuges ou ex-companheiros que demonstrem necessidade<br>

&nbsp;&nbsp;&nbsp;* Ascendentes (pais, avós) em casos específicos<br>

&nbsp;&nbsp;&nbsp;* Parceiros em união estável, inclusive homoafetiva, desde que comprovada a dependência econômica<br><br>

Importante: não basta alegar, cabe ao requerente demonstrar necessidade.<br><br>

&nbsp;&nbsp;&nbsp; 2.2 Quem pode ser obrigado a pagar<br><br>

Quem tem obrigação de pagar é quem tem possibilidade (recursos) para fazê-lo. Essa avaliação é feita levando-se em consideração:<br>

&nbsp;&nbsp;&nbsp;* Renda, patrimônio, despesas do alimentante<br>

&nbsp;&nbsp;&nbsp;* Grau de vínculo com o beneficiário<br>

&nbsp;&nbsp;&nbsp;* Proporcionalidade entre necessidade e possibilidade<br><br>

Se o alimentante não tiver condições (por exemplo, desemprego, doença) pode pedir redução ou até exoneração da pensão.<br><br>
<strong>
3. Fixação, revisão e exoneração da pensão</strong><br><br>
&nbsp;&nbsp;&nbsp;  3.1 Fixação inicial<br><br>

Quando ainda não existe acordo entre as partes, a pensão é fixada por decisão judicial, que vai calcular um valor com base nos critérios já mencionados. Frequentemente o juiz exige comprovantes de renda, despesas e documentos que demonstrem a necessidade. Às vezes um acordo extrajudicial é possível, mas só será válido se for homologado judicialmente (ou seja, tiver força de sentença).
<br><br>
&nbsp;&nbsp;&nbsp; 3.2 Revisão<br><br>

Mudanças na realidade das partes permitem pedido de revisão da pensão (aumento ou redução). Por exemplo:<br>

&nbsp;&nbsp;&nbsp;* O alimentando teve aumento de despesas (saúde, escola, tratamento)<br>

&nbsp;&nbsp;&nbsp;* O alimentante perdeu renda ou teve alteração financeira brusca<br>

&nbsp;&nbsp;&nbsp;* Se comprovada nova situação econômica que justifique o ajuste<br><br>


É importante ter documentos para demonstrar essa mudança de situação. Um advogado pode ajudar a compilar tudo e apresentar ao juiz.<br><br>

&nbsp;&nbsp;&nbsp; 3.3 Exoneração / extinção<br><br>

A pensão pode ser extinta ou reduzida definitivamente quando:<br>

&nbsp;&nbsp;&nbsp;* O alimentando alcança autonomia financeira<br>

&nbsp;&nbsp;&nbsp;* O alimentando morre<br>

&nbsp;&nbsp;&nbsp;* Se casar, constituir união estável (em alguns casos, dependendo do que o juiz decidir)<br>

&nbsp;&nbsp;&nbsp;* Em casos extremos de comportamento indigno do credor (ofensas graves, conduta desonrosa), isso pode levar à redução ou exoneração parcial (conforme Enunciado n.º 345 da IV Jornada de Direito Civil)
<br><br>
É preciso ter cuidado: não basta haver um novo casamento ou mudança, tudo depende da análise judicial.<br><br>
<strong>
4. Execução e sanções pelo inadimplemento</strong><br><br>

Quando a pensão não é paga, o credor pode (e deve) buscar mecanismos legais para essa cobrança. Alguns dos mais usados:<br>

&nbsp;&nbsp;&nbsp;* Execução de alimentos no âmbito do processo de alimentos, que é um rito especial mais célere.<br>

&nbsp;&nbsp;&nbsp;* Desconto em folha de pagamento do devedor<br>

&nbsp;&nbsp;&nbsp;* Penhora de bens ou de rendimentos<br>

&nbsp;&nbsp;&nbsp;* Protesto do devedor<br>

&nbsp;&nbsp;&nbsp;* Prisão civil do devedor, em casos de inadimplemento voluntário, inescusável e referente a até três prestações alimentícias vencidas, se o devedor continuar não pagando, mesmo após intimação judicial, pode ser mandado para prisão civil por prazo determinado.
<br>
&nbsp;&nbsp;&nbsp;* Mas atenção: a prisão só é cabível nas três últimas prestações anteriores + as que vencerem durante o processo. “Dívidas antigas” não têm esse caráter alimentar para prisão civil.
<br><br>
É essencial acompanhar o processo e contar com um advogado para fazer os requerimentos certos.<br><br>
<strong>
5. Decisões recentes e temas em debate</strong><br><br>

&nbsp;&nbsp;&nbsp;     5.1 Prestação de contas e pensão com bens comuns após separação<br><br>


O Superior Tribunal de Justiça (STJ) já tem casos em que exige que partes prestem contas sobre a administração dos bens comuns quando há pensão envolvida e separação litigiosa. Isso pode interferir no valor ou na forma de pagamento da pensão.
<br><br>
&nbsp;&nbsp;&nbsp;5.2 Alimentos entre ex-cônjuges: caráter mais restrito<br><br>


Antes, era comum que pensão entre ex-cônjuges fosse concedida com certa regularidade. Hoje, há tendência jurisprudencial no sentido de que esses alimentos devem ter caráter temporário, restrito e dependente de demonstrada necessidade e motivo justificável (por exemplo, incapacidade de se recolocar profissionalmente).
<br><br>
&nbsp;&nbsp;&nbsp;5.3 Procedimento de exoneração e avaliação da “indignidade”<br><br>


Diferentes tribunais têm interpretado de formas variadas o que configura “conduta indigno” para que possa haver exoneração parcial. O Enunciado 345 da IV Jornada de Direito Civil admite essa possibilidade em casos de ofensas graves ou comportamento inadequado por parte do credor.
<br><br><strong>
6. Questões frequentes (e quando procurar um advogado)</strong><br><br>


&nbsp;&nbsp;&nbsp;<strong>*</strong> “Posso pedir pensão mesmo que o outro não seja meu ex-cônjuge?”
<br>
Sim, em casos de união estável ou até em outros vínculos pessoais, se houver dependência econômica. Mas tudo depende de comprovação.<br><br>

&nbsp;&nbsp;&nbsp;<strong>*</strong> “E se ele não tem renda fixa, mas ganha por trabalho informal?”
<br>
Ainda assim pode haver obrigação; o juiz vai avaliar capacidade econômica real, mesmo que variável.<br><br>

&nbsp;&nbsp;&nbsp;<strong>*</strong> “Se eu descobri que ele teve um aumento salarial grande, posso pedir aumento de pensão?”
<br>
Sim, cabível pedido de revisão com base em novos fatos.<br><br>

&nbsp;&nbsp;&nbsp;<strong>*</strong> “Me atrasou e não pagou: posso pedir prisão?”
<br>
Sim, se for inadimplemento voluntário e inescusável de até três parcelas anteriores + as que vencerem durante o processo. Mas o advogado deve fazer o requerimento no processo de execução e acompanhar.
<br><br>
Em todos esses casos, é fundamental consultar um advogado especializado em Direito de Família. Só ele poderá analisar documentos e circunstâncias específicas do seu caso e orientar qual o melhor caminho (revisão, execução, exoneração etc).
<br><br>
<strong>7. Conclusão</strong><br><br>

A pensão alimentícia é um instituto essencial para garantir dignidade às pessoas que dependem financeiramente de terceiros. Ela envolve equilíbrio entre necessidade e possibilidade, e não é algo fixo ou intocável, pode (e deve) ser revisada ou extinta conforme a realidade de cada caso. Se você está enfrentando uma situação de pensão alimentícia (seja como quem paga ou como quem recebe), não enfrente isso sozinho. Um advogado poderá orientar, propor ações ou revisões, acompanhar processos e ajudar a proteger seus direitos.
<br><br>
🔎 Gostou deste conteúdo? Continue acompanhando nosso blog para mais informações sobre seus direitos.</p>
    `,
    author: 'Jonatas Costa',
    date: '2025-10-2',
    category: 'Direito Civil',
    image: 'https://saudnascimento.adv.br/wp-content/uploads/2019/07/pens%C3%A3o.jpg',
    readTime: '8 min',
  },
  {
    id: 5,
    slug: 'responsabilidades-do-estacionamento',
    title: 'Responsabilidades do Estacionamento: Seus Direitos como Consumidor',
    excerpt: 'Saiba quais são seus direitos como consumidor e as obrigações dos estacionamentos',
    content: `
      <p style="text-align: justify;">Você já deixou seu carro em um estacionamento e ficou em dúvida sobre quem seria responsável se algo acontecesse com ele? 🤔 Essa é uma preocupação comum e que gera muitas discussões no Direito do Consumidor. Afinal, os estacionamentos, sejam pagos ou gratuitos, têm responsabilidades legais que precisam ser conhecidas.</p>
      <br>
      <p style="text-align: justify;">Neste artigo, vamos explicar de forma clara quais são os direitos do consumidor, as obrigações dos estacionamentos, novidades sobre o tema e como agir em caso de problemas.</p>
      <br>
      <h3><strong>O que diz a lei sobre os estacionamentos?</strong></h3>
      <br>
      <p style="text-align: justify;">De acordo com o Código de Defesa do Consumidor (CDC), todo fornecedor de serviços deve responder pelos danos causados aos clientes. Isso significa que os estacionamentos têm o dever de garantir a segurança do veículo e dos bens deixados em seu interior.</p>
      <br>
      <p style="text-align: justify;">Ou seja: aquelas placas com a frase "não nos responsabilizamos por objetos deixados no interior do veículo" <strong>não têm validade jurídica</strong>. A responsabilidade do estacionamento não pode ser afastada por avisos ou cláusulas abusivas.</p>
            <br>
      <h3><strong>Responsabilidade objetiva: o que significa?</strong></h3>
      <br>
      <p style="text-align: justify;">O estacionamento responde de forma objetiva, ou seja, independentemente de culpa. Se o carro for furtado, arranhado, batido ou sofrer qualquer outro dano dentro do local, o consumidor tem direito à reparação, sem precisar provar que houve negligência do estabelecimento.</p>
<br>      
      <h3><strong>Decisões recentes da Justiça</strong></h3>
      <br>
      <p style="text-align: justify;">O Superior Tribunal de Justiça (STJ) já consolidou o entendimento de que estacionamentos são responsáveis por:
<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;* Furtos ou roubos de veículos e objetos em seu interior;
<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;* Danos causados por terceiros, como colisões dentro do estacionamento;
<br>
&nbsp;&nbsp;&nbsp;* Falta de vigilância ou segurança, mesmo quando alegam que não conseguem controlar todos os veículos.
<br>
<br>
Além disso, algumas cidades vêm criando normas específicas para estacionamentos, exigindo a instalação de câmeras, vigilância reforçada e até contratação de seguros para proteger os consumidores.</p>
      <br>
      <h3><strong>Situações comuns que geram dúvidas</strong></h3><br><p style="text-align: justify;">
      🔹 Estacionamento gratuito também tem responsabilidade?<br>

 Sim. O simples fato de o consumidor confiar seu veículo ao estabelecimento já gera responsabilidade, mesmo sem pagamento.

<br><br>
🔹 E os objetos dentro do carro?<br>

 Se comprovado que estavam no interior do veículo, também estão protegidos. Isso inclui malas, eletrônicos e outros pertences.
<br><br>

🔹 E se houver contrato ou placa excluindo a responsabilidade?
<br>
 Não tem validade. O CDC protege o consumidor contra cláusulas abusivas.<br>
      <br>
      <h3><strong>O que fazer em caso de problema?</strong></h3>
      <br>
      <p>Se o seu veículo sofrer furto, roubo ou dano em um estacionamento, siga estes passos:<br>

🔹Avise imediatamente o responsável pelo estacionamento;
<br>
🔹Registre um boletim de ocorrência;
<br>
🔹Guarde todos os comprovantes, como ticket, fotos do local e do dano;
<br>
🔹Procure orientação com um advogado especializado em Direito do Consumidor.</p><br>
<h3><strong>Conclusão: sempre consulte um advogado</strong></h3>
      <br>
      <p style="text-align: justify;">Os estacionamentos têm obrigação legal de proteger os veículos e responder por danos. Como consumidor, você tem direito à reparação em caso de problemas.
<br>
👉 Porém, cada caso tem suas particularidades. Por isso, sempre procure um advogado de confiança para esclarecer dúvidas e indicar o melhor caminho. Ele poderá auxiliar na negociação, reclamação junto aos órgãos de defesa do consumidor ou até mesmo em uma ação judicial.
<br><br>
🔎 Gostou deste conteúdo? Continue acompanhando nosso blog para mais informações sobre seus direitos como consumidor.</p>
    `,
    author: 'Jonatas Costa',
    date: '2024-10-14',
    category: 'Direito do Consumidor',
    image: 'https://static.vecteezy.com/ti/fotos-gratis/p1/4849895-vista-superior-da-area-de-estacionamento-com-um-pequeno-jardim-em-um-edificio-moderno-foto.jpg',
    readTime: '6 min',
  },
]
