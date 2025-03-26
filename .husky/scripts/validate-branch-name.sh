#!/bin/sh

branch_name=$(git symbolic-ref --short HEAD)

# Actualiza la expresión regular para manejar la estructura `feature/HU-Descripcion`
echo "$branch_name" | grep -E '^(bugfix|hotfix)/[a-z0-9._-]+$|^feature/[0-9]+-[a-zA-Z0-9._-]+$' > /dev/null
if [ $? -ne 0 ]; then
  echo "Error: El nombre de la rama '$branch_name' es inválido."
  echo "Los nombres de las ramas deben seguir el patrón:"
  echo "- (bugfix|hotfix)/<nombre>"
  echo "- feature/<Número>-<Descripcion>"
  exit 1
fi