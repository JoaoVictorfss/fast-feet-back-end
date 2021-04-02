<h1 align="center"> Fastfeet </h1>

<p align="center">
  <img src="http://img.shields.io/static/v1?label=issues&message=0&color=yellow&style=plastic"/>
    <img src="https://img.shields.io/static/v1?label=node&message=interpretador&color=blue&style=plastic&logo=node.js"/>
  <img src="http://img.shields.io/static/v1?label=last%20commit&message=april&color=information&style=plastic"/>
  <img src="http://img.shields.io/static/v1?label=license&message=MIT&color=green&style=plastic"/>
  <img src="http://img.shields.io/static/v1?label=status&message=em%20desenvolvimento&color=GREENstyle=plastic"/>
</p>

### Tópicos
:small_blue_diamond: [Descrição do projeto](#descrição-do-projeto-star)

:small_blue_diamond: [Pré-requisitos](#pré-requisitos)

:small_blue_diamond: [Configuração da aplicação](#configurando)

:small_blue_diamond: [Executando a aplicação](#executando-a-aplicação)

> Status do Projeto: Em desenvolvimento :warning:

## Descrição do Projeto :star:
<p align="justify">
  O Fastfeet é um sistema de gerenciamento de entregas, sendo o desafio final do curso Bootcamp-GoStack 09 da Rocketseat.
  Esta é a api referente ao front-end da aplicação(<a href="https://github.com/JoaoVictorfss/fastfeet-web">fastfeet-web</a>).
</p>

Este é o desafio final criado no Bootcamp da Rocketseat. Nela desenvolvemos um serviço apelidado de FastFeet que é um app para uma transportadora fictícia. O admin do sistema tem/usa suas funcionalidades pelo cliente web feito em ReactJS, enquanto os entregadores usam o cliente mobile desenvolvido em React Native para criarem uma conta e usarem suas funcionalidades, sendo toda a lógica gerenciada pela api desenvolvida em NodeJS.

### Pré-requisitos:
#### Ferramentas:
- Yarn/Npm
- Docker

#### Serviços:
- Postgres
- Redis

#### Configurando:
1. clone o projeto
   > $ https://github.com/JoaoVictorfss/fastfeet-back-end.git

2. Entre na pasta
   > $ cd fastfeet-back-end

3. Instale as dependências<br>
    > $ npm install

4. Instanciar o Redis e alterar as variáveis de ambiente
    > $ docker run --name fastfeet-redis -p 6379:6379 -d -t redis:alpine

    ```
    REDIS_HOST=127.0.0.1
    REDIS_PORT=6379
    ```
5. instanciar o banco de dados postgres e alterar as variáveis de ambiente
   > \$ docker run --name fastfeet-postgres -e POSTGRES_PASSWORD=12345678 -p 5432:5432 -d postgres

    ```
    # Database
    DB_HOST=localhost
    DB_USER=postgres
    DB_PASS=12345678
    DB_NAME=fastfeet
    ```

6. Para simular o envio de emails utilizamos o serviço [mailtrap.io](https://mailtrap.io). Crie uma conta e coloque os dados fornecidos por eles nas linhas abaixo do arquivo .env
    ```
    MAIL_HOST=
    MAIL_PORT=
    MAIL_USER=
    MAIL_PASS=
    ```

7. Execute as migrations
    > $ npm run migrations

#### Executando a aplicação:
   > $npm run dev






