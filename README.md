# Projet Apiculture

Application web Symfony pour la gestion d'un rucher, la localisation géographique des ruches, le suivi des interventions et l'enregistrement des récoltes de miel.

## Architecture technique
- **Framework** : Symfony
- **ORM** : Doctrine (entités Ruche, Intervention, Recolte)
- **Moteur de template** : Twig
- **Conteneurisation** : Docker Compose (PostgreSQL 16)
- **Cartographie** : OpenStreetMap France / Leaflet

## Lancement avec Docker

1. Démarrer la base de données avec Docker :
```bash
docker compose up -d
```

2. Mettre à jour la base de données :
```bash
php bin/console doctrine:database:create --if-not-exists
php bin/console doctrine:schema:update --force
```

3. Démarrer le serveur web :
```bash
php -S 127.0.0.1:8000 -t public
```

Accès : `http://localhost:8000`  
Compte de démonstration : `apiculteur` / `1234`
