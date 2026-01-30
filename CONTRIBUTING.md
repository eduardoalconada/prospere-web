# Guía de Flujo de Trabajo (Git Workflow)

**REGLA DE ORO:** NUNCA trabajar directamente en la rama `main`.
* `main`: Producción (Código estable/sagrado).
* `develop`: Desarrollo (Tu zona de trabajo).

---

## 1. Empezar a trabajar (Inicio del día)
Objetivo: Sincronizar tu entorno local con el servidor.

```bash
git checkout develop
git pull origin develop
```

## 2. Guardar cambios (Durante el día)
Objetivo: Guardar progreso localmente.

```bash
git status
git add .
git commit -m "Descripción breve del cambio"
```

## 3. Subir cambios (Final de tarea/día)
Objetivo: Enviar código al repositorio remoto.

```bash
git push origin develop
```

## 4. Despliegue a Producción
Objetivo: Fusionar `develop` en `main` cuando el código es estable.

```bash
# 1. Moverse a producción y actualizar
git checkout main
git pull origin main

# 2. Fusionar cambios de desarrollo
git merge develop

# 3. Subir a producción
git push origin main

# 4. IMPORTANTE: Volver a desarrollo para seguir trabajando
git checkout develop
```

## 5. Solución de Problemas

### Descartar cambios locales (Reset)
Si has roto algo y quieres volver a como estaba en el último commit:
```bash
git checkout -- nombre_del_archivo
# O para descartar todo: git checkout .
```

### Conflictos de Merge
1. Git te avisará si hay conflictos.
2. Abre los archivos marcados en el editor.
3. Elige qué líneas conservar y borra las marcas de conflicto (`<<<<<<<`, `=======`, `>>>>>>>`).
4. Guarda y finaliza:
   ```bash
   git add .
   git commit -m "Conflictos resueltos"
   ```