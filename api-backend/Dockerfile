# Etapa 1: Construção (Build)
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copia o arquivo de projeto e restaura as dependências
COPY *.csproj ./
RUN dotnet restore

# Copia o resto do código e publica a versão final otimizada
COPY . ./
RUN dotnet publish -c Release -o /app/publish

# Etapa 2: Execução (Runtime)
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

# Define a porta 8080 (que é a porta padrão que o Render espera)
ENV ASPNETCORE_HTTP_PORTS=8080
EXPOSE 8080

# Comando para iniciar a sua API
ENTRYPOINT ["dotnet", "apiBackend.dll"]