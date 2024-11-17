# **Periódicos Talk**

## **Introdução**

O **Periódicos Talk** é um protótipo de **assistente de voz inclusivo**, desenvolvido para facilitar o acesso a conteúdos acadêmicos no Portal de Periódicos. Ele utiliza tecnologias modernas para garantir acessibilidade e usabilidade, permitindo que usuários realizem pesquisas por meio de comandos de voz.

---

## **Tecnologias Utilizadas**

### **Front-End**
- React.js
- Vite

### **Back-End**
- Python (Flask para a API)
- Open Alex

---

## **Requisitos**

Certifique-se de ter as seguintes ferramentas instaladas no seu ambiente:

- **Node.js** (para o front-end)
- **Python 3.9+** (para o back-end)
- **npm ou yarn** (para gerenciar pacotes no front-end)
- **pip** (para gerenciar pacotes no back-end)

---

## **Instalação**

### **1. Clonar o Repositório**

```bash
git clone https://github.com/Jhaysavi/Periodicos-Talk.git
cd periodicos-talk
```

### **2. Configuração do Front-End**

1. Acesse a pasta do front-end:
   ```bash
   cd front
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

4. O front-end estará disponível em:  
   [http://localhost:5173](http://localhost:5173)

---

### **3. Configuração do Back-End**

1. Acesse a pasta do back-end:
   ```bash
   cd back
   ```

2. Crie um ambiente virtual (opcional, mas recomendado):
   ```bash
   python -m venv venv
   source venv/bin/activate # Linux/Mac
   venv\Scripts\activate    # Windows
   ```

3. Instale as dependências:
   ```bash
   pip install -r requirements.txt
   ```

4. Inicie o servidor:
   ```bash
   python meu_ambiente/scripts/app.py
   ```

5. O back-end estará disponível em:  
   [http://localhost:5000](http://localhost:5000)

---

## **Uso**

1. Abra o front-end no navegador e clique no botão para iniciar a interação por voz.  
2. Realize pesquisas usando comandos de voz.  
---

## **Próximos Passos**

- Integração real com o Portal de Periódicos.
- Implementação de algoritmos avançados de recomendação.
- Adição de suporte multilíngue.

---

## **Contribuição**

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests.

---

## **Licença**

Este projeto está licenciado sob a [MIT License](LICENSE).

---

**Vamos juntos construir um futuro mais acessível para a ciência!**
