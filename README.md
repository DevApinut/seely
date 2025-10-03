# **Seely API — Quickstart Guide**

---

## **Step 1: Start Docker Containers**
Open Rancher (to run Docker) and execute:
```bash
docker compose up -d
```

---

## **Step 2: Change Directory**
Move into the project folder:
```bash
cd seely-api
```

---

## **Step 3: Install Dependencies**
```bash
npm install
```

---

## **Step 4: Run Application in Dev Mode**
```bash
npm run start:dev
```

This will automatically run **migration:run** and start the application at **http://localhost:3000**

---

## 📖 **API Documentation (Swagger)**
Open in browser:
```
http://localhost:3000/api
```

---

## **Keycloak Admin Console**
- URL: <https://localhost:8443>
- Username: **admin**
- Password: **admin**

---

## **Keycloak API — Login**
**Endpoint**
```
POST http://localhost:3000/api/v1/keycloak/login
```

**User Login**
  username: apinut555@gmail.com
  password: 1234
  
---

## **Keycloak API  — Login**
**Endpoint**
```
POST http://localhost:3000/api/v1/keycloak/logout
```

---

## **Database Connection**
```
postgres://postgres:pass2word@localhost:5432/seelyuat
```

---

Now your app, Swagger docs, Keycloak, and DB connection are all set up!
