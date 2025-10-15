# 📊 Explicação do Cálculo do INSS 2025

## 🔍 **Como o INSS está sendo calculado**

### **Base de Cálculo Correta**:
O INSS é calculado sobre a soma de:
- ✅ **Saldo de Salário** (dias trabalhados no último mês)
- ✅ **13º Proporcional** (meses trabalhados no ano)
- ✅ **Salário Família** (proporcional aos dias trabalhados)

```javascript
// Base de cálculo do INSS
const baseCalculoINSS = calculo.saldoSalario + calculo.decimoTerceiro + calculo.salarioFamilia
```

### **Tabela INSS 2025 Implementada**:

| Faixa Salarial | Alíquota | Implementação |
|----------------|----------|---------------|
| Até R$ 1.518,00 | 7,5% | `baseCalculo * 0.075` |
| R$ 1.518,01 a R$ 2.793,88 | 9% | Progressiva |
| R$ 2.793,89 a R$ 4.190,83 | 12% | Progressiva |
| R$ 4.190,84 a R$ 8.157,41 | 14% | Progressiva |

### **Cálculo Progressivo**:

```javascript
const calcularINSS = (baseCalculo: number) => {
  // Tabela INSS 2025
  if (baseCalculo <= 1518.00) {
    return baseCalculo * 0.075
  } else if (baseCalculo <= 2793.88) {
    return (1518.00 * 0.075) + ((baseCalculo - 1518.00) * 0.09)
  } else if (baseCalculo <= 4190.83) {
    return (1518.00 * 0.075) + ((2793.88 - 1518.00) * 0.09) + ((baseCalculo - 2793.88) * 0.12)
  } else if (baseCalculo <= 8157.41) {
    return (1518.00 * 0.075) + ((2793.88 - 1518.00) * 0.09) + ((4190.83 - 2793.88) * 0.12) + ((baseCalculo - 4190.83) * 0.14)
  } else {
    // Teto máximo
    return (1518.00 * 0.075) + ((2793.88 - 1518.00) * 0.09) + ((4190.83 - 2793.88) * 0.12) + ((8157.41 - 4190.83) * 0.14)
  }
}
```

## 📋 **Exemplo Prático**

### **Dados do Exemplo**:
- **Salário**: R$ 1.518,00
- **Tempo**: 1 ano e 9 meses
- **Dias trabalhados**: 14 dias (último mês)
- **Filhos**: 1

### **Cálculo da Base**:

#### **1. Saldo de Salário**:
```
Saldo = (1.518,00 / 30) * 14 = R$ 708,40
```

#### **2. 13º Proporcional**:
```
Meses = 21 meses = 21/12 = 1,75
13º = 1.518,00 * 1,75 = R$ 2.656,50
Mas limitado a: 1.518,00 * (9/12) = R$ 1.138,50
```

#### **3. Salário Família**:
```
Salário Família = (65,00 / 30) * 14 * 1 = R$ 30,33
```

#### **4. Base Total para INSS**:
```
Base = 708,40 + 1.138,50 + 30,33 = R$ 1.877,23
```

### **Cálculo do INSS Progressivo**:

Como R$ 1.877,23 está na segunda faixa (entre R$ 1.518,01 e R$ 2.793,88):

```javascript
// Primeira faixa: R$ 1.518,00 × 7,5%
primeira = 1518.00 * 0.075 = R$ 113,85

// Segunda faixa: (R$ 1.877,23 - R$ 1.518,00) × 9%
segunda = (1877.23 - 1518.00) * 0.09 = 359.23 * 0.09 = R$ 32,33

// Total INSS
INSS = 113,85 + 32,33 = R$ 146,18
```

## 🔄 **Diferença do Cálculo Anterior**

### **Antes (Incorreto)**:
- ❌ Base: Apenas salário mensal (R$ 1.518,00)
- ❌ INSS: R$ 113,85

### **Agora (Correto)**:
- ✅ Base: Saldo + 13º + Salário Família (R$ 1.877,23)
- ✅ INSS: R$ 146,18

### **Impacto no Total**:
- **Diferença**: R$ 146,18 - R$ 113,85 = **R$ 32,33 a mais de desconto**
- **Total líquido**: Diminui em R$ 32,33

## ⚖️ **Justificativa Legal**

### **Por que calcular sobre essas verbas?**

1. **Saldo de Salário**: 
   - ✅ Remuneração do trabalho efetivo
   - ✅ Sujeito ao INSS

2. **13º Proporcional**:
   - ✅ Gratificação natalina proporcional
   - ✅ Sujeito ao INSS

3. **Salário Família**:
   - ✅ Benefício previdenciário
   - ✅ Sujeito ao INSS

### **Verbas NÃO sujeitas ao INSS**:
- ❌ **Aviso Prévio**: Indenização, não remuneração
- ❌ **Férias + 1/3**: Período de descanso
- ❌ **Multa FGTS**: Indenização

## 🧮 **Fórmula Resumida**

```
Base INSS = Saldo Salário + 13º Proporcional + Salário Família

INSS = Aplicar tabela progressiva 2025 sobre a Base INSS

Total Líquido = (Todas as verbas) - INSS
```

## ✅ **Validação**

### **Tabela 2025 Correta**:
- ✅ Até R$ 1.518,00: 7,5%
- ✅ R$ 1.518,01 a R$ 2.793,88: 9%
- ✅ R$ 2.793,89 a R$ 4.190,83: 12%
- ✅ R$ 4.190,84 a R$ 8.157,41: 14%

### **Base de Cálculo Correta**:
- ✅ Saldo de salário incluído
- ✅ 13º proporcional incluído
- ✅ Salário família incluído
- ✅ Verbas indenizatórias excluídas

### **Cálculo Progressivo**:
- ✅ Alíquotas aplicadas por faixa
- ✅ Não há desconto sobre o teto
- ✅ Cálculo matemático correto

---

**O cálculo do INSS agora está correto conforme a legislação e tabela 2025!** ✅
