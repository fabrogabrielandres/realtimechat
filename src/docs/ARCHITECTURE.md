# Architecture - Room Authentication Flow

## Flow Diagram

```mermaid
graph TD
    A[Request /room/123] --> B{¿Path válido?}
    B -->|No| C[Redirect /]
    B -->|Sí| D[Buscar sala en Redis]
    D --> E{¿Sala existe?}
    E -->|No| F[Redirect /?error=room-not-found]
    E -->|Sí| G{¿Usuario tiene token?}
    G -->|Sí| H{¿Token válido en sala?}
    G -->|No| I{¿Sala llena?}
    I -->|Sí| J[Redirect /?error=room-full]
    I -->|No| K[Generar nuevo token]
    H -->|Sí| L[Permitir acceso]
    H -->|No| M[Redirect /?error=invalid-token]
    K --> N[Set cookie + Redis]
    N --> L

    