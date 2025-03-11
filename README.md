# API SMS AxiomText

API de service SMS pour l'envoi de messages et la gestion des codes OTP.

## Table des matières
- [Introduction](#introduction)
- [Authentification](#authentification)
- [Endpoints](#endpoints)
- [Exemples d'utilisation](#exemples-dutilisation)
- [Gestion des erreurs](#gestion-des-erreurs)
- [Limites et quotas](#limites-et-quotas)

## Introduction

L'API SMS AxiomText vous permet d'envoyer des SMS et de gérer des codes OTP (One-Time Password) dans vos applications. L'API est simple à utiliser et offre une documentation complète.

**URL de base :** `https://api.axiomtext.com/api`

## Authentification

Toutes les requêtes à l'API doivent inclure votre token d'authentification dans l'en-tête HTTP.

```bash
Authorization: Bearer votre_token_api
```

Pour obtenir votre token API :
1. Connectez-vous à votre tableau de bord sur [https://www.axiomtext.com](https://www.axiomtext.com)
2. Accédez à la section "Settings"
3. Accédez à la partie "API"
4. Cliquez sur "Générer un token"
5. **Important :** Copiez immédiatement votre token car il ne sera plus visible par la suite

## Endpoints

### Envoyer un SMS

```bash
POST /sms/message
```

**Paramètres :**
```json
{
  "to": "+221xxxxxxxxx",
  "message": "Votre message",
  "signature": "Nom de la société" // Optionnel
}
```

**Réponse réussie :**
```json
{
  "success": true,
  "message": "SMS envoyé avec succès",
  "data": {
    "messageId": "123456789",
    "remainingCredits": 999,
    "cost": 1,
    "status": "sent"
  }
}
```

### Envoyer un code OTP

```bash
POST /sms/otp/send
```

**Paramètres :**
```json
{
  "phone": "+221xxxxxxxxx",
  "signature": "Nom de la société" // Optionnel
}
```

**Réponse réussie :**
```json
{
  "success": true,
  "message": "Code OTP envoyé avec succès",
  "remainingCredits": 999
}
```

### Vérifier un code OTP

```bash
POST /sms/otp/verify
```

**Paramètres :**
```json
{
  "phone": "+221xxxxxxxxx",
  "code": "123456"
}
```

**Réponse réussie :**
```json
{
  "success": true,
  "message": "Code OTP vérifié avec succès"
}
```

## Exemples d'utilisation

### cURL

```bash
# Envoyer un SMS
curl -X POST https://api.axiomtext.com/api/sms/message \
  -H "Authorization: Bearer votre_token_api" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "+221xxxxxxxxx",
    "message": "Votre message",
    "signature": "MaSociete"
  }'

# Envoyer un OTP
curl -X POST https://api.axiomtext.com/api/sms/otp/send \
  -H "Authorization: Bearer votre_token_api" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+221xxxxxxxxx",
    "signature": "MaSociete"
  }'

# Vérifier un OTP
curl -X POST https://api.axiomtext.com/api/sms/otp/verify \
  -H "Authorization: Bearer votre_token_api" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+221xxxxxxxxx",
    "code": "123456"
  }'
```

### JavaScript

```javascript
const API_TOKEN = 'votre_token_api';
const API_URL = 'https://api.axiomtext.com/api';

// Envoyer un SMS
async function sendSMS(to, message, signature = 'MaSociete') {
  try {
    const response = await fetch(`${API_URL}/sms/message`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ to, message, signature })
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de l\'envoi:', error);
    throw error;
  }
}

// Envoyer un OTP
async function sendOTP(phone, signature = 'MaSociete') {
  try {
    const response = await fetch(`${API_URL}/sms/otp/send`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone, signature })
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de l\'envoi:', error);
    throw error;
  }
}

// Vérifier un OTP
async function verifyOTP(phone, code) {
  try {
    const response = await fetch(`${API_URL}/sms/otp/verify`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone, code })
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de la vérification:', error);
    throw error;
  }
}
```

### PHP

```php
<?php
$apiToken = 'votre_token_api';
$apiUrl = 'https://api.axiomtext.com/api';

// Envoyer un SMS
function sendSMS($to, $message, $signature = 'MaSociete') {
    global $apiToken, $apiUrl;
    
    $data = [
        'to' => $to,
        'message' => $message,
        'signature' => $signature
    ];
    
    $ch = curl_init("$apiUrl/sms/message");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Authorization: Bearer $apiToken",
        'Content-Type: application/json'
    ]);
    
    $response = curl_exec($ch);
    $error = curl_error($ch);
    curl_close($ch);
    
    if ($error) {
        throw new Exception("Erreur lors de l'envoi: $error");
    }
    
    return json_decode($response, true);
}

// Envoyer un OTP
function sendOTP($phone, $signature = 'MaSociete') {
    global $apiToken, $apiUrl;
    
    $data = [
        'phone' => $phone,
        'signature' => $signature
    ];
    
    $ch = curl_init("$apiUrl/sms/otp/send");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Authorization: Bearer $apiToken",
        'Content-Type: application/json'
    ]);
    
    $response = curl_exec($ch);
    $error = curl_error($ch);
    curl_close($ch);
    
    if ($error) {
        throw new Exception("Erreur lors de l'envoi: $error");
    }
    
    return json_decode($response, true);
}

// Vérifier un OTP
function verifyOTP($phone, $code) {
    global $apiToken, $apiUrl;
    
    $data = [
        'phone' => $phone,
        'code' => $code
    ];
    
    $ch = curl_init("$apiUrl/sms/otp/verify");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Authorization: Bearer $apiToken",
        'Content-Type: application/json'
    ]);
    
    $response = curl_exec($ch);
    $error = curl_error($ch);
    curl_close($ch);
    
    if ($error) {
        throw new Exception("Erreur lors de la vérification: $error");
    }
    
    return json_decode($response, true);
}
```

### Python

```python
import requests

API_TOKEN = 'votre_token_api'
API_URL = 'https://api.axiomtext.com/api'

def send_sms(to, message, signature='MaSociete'):
    """
    Envoie un SMS via l'API.
    
    Args:
        to (str): Numéro de téléphone du destinataire
        message (str): Contenu du message
        signature (str, optional): Signature de l'expéditeur
    
    Returns:
        dict: Réponse de l'API
    """
    try:
        response = requests.post(
            f"{API_URL}/sms/message",
            headers={
                'Authorization': f'Bearer {API_TOKEN}',
                'Content-Type': 'application/json'
            },
            json={
                'to': to,
                'message': message,
                'signature': signature
            }
        )
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Erreur lors de l'envoi: {e}")
        raise

def send_otp(phone, signature='MaSociete'):
    """
    Envoie un code OTP via l'API.
    
    Args:
        phone (str): Numéro de téléphone du destinataire
        signature (str, optional): Signature de l'expéditeur
    
    Returns:
        dict: Réponse de l'API
    """
    try:
        response = requests.post(
            f"{API_URL}/sms/otp/send",
            headers={
                'Authorization': f'Bearer {API_TOKEN}',
                'Content-Type': 'application/json'
            },
            json={
                'phone': phone,
                'signature': signature
            }
        )
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Erreur lors de l'envoi: {e}")
        raise

def verify_otp(phone, code):
    """
    Vérifie un code OTP via l'API.
    
    Args:
        phone (str): Numéro de téléphone
        code (str): Code OTP à vérifier
    
    Returns:
        dict: Réponse de l'API
    """
    try:
        response = requests.post(
            f"{API_URL}/sms/otp/verify",
            headers={
                'Authorization': f'Bearer {API_TOKEN}',
                'Content-Type': 'application/json'
            },
            json={
                'phone': phone,
                'code': code
            }
        )
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Erreur lors de la vérification: {e}")
        raise
```

## Gestion des erreurs

L'API utilise les codes d'erreur HTTP standard :

- `400` : Requête invalide (paramètres manquants ou incorrects)
- `401` : Non authentifié (token manquant ou invalide)
- `403` : Non autorisé (crédits insuffisants)
- `429` : Trop de requêtes (limite de requêtes dépassée)

Exemple de réponse d'erreur :
```json
{
  "error": "Message d'erreur",
  "status": 400
}
```

## Limites et quotas

### Limites générales
- 1000 requêtes par heure par IP
- 1000 requêtes par heure par utilisateur
- Les limites se réinitialisent toutes les heures

### Codes OTP
- Validité : 1 minute
- Format : 6 chiffres
- Un seul code actif par numéro

### En-têtes de limite
Chaque réponse inclut des en-têtes pour suivre votre utilisation :
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1625097600000
Retry-After: 3600 // Uniquement si limite dépassée
```

## Support

Pour toute question ou assistance, visitez notre site web : [https://www.axiomtext.com](https://www.axiomtext.com)
