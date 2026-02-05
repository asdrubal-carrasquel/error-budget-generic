FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
# Install curl for healthchecks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["evaluation-engine.csproj", "."]
RUN dotnet restore "evaluation-engine.csproj"
COPY . .
RUN dotnet build "evaluation-engine.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "evaluation-engine.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "evaluation-engine.dll"]
