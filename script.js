body {
  font-family: 'Poppins', sans-serif;
  margin: 0;
  background: linear-gradient(120deg,#f6f9fc,#eef1ff);
}

.container {
  max-width: 1200px;
  margin: auto;
  padding: 0 20px;
}

.section-title {
  text-align: center;
  margin-bottom: 30px;
}

.navbar {
  display:flex;
  justify-content:space-between;
  padding:20px;
  background:#fff;
}

.hero-inner {
  display:flex;
  justify-content:space-between;
  align-items:center;
  flex-wrap:wrap;
  gap:40px;
}

.hero h1 {
  font-size:40px;
}

.hero-img {
  width:300px;
  animation: float 4s infinite;
}

@keyframes float {
  50% { transform: translateY(-10px); }
}

.btn {
  background: linear-gradient(45deg,#6a11cb,#2575fc);
  color:#fff;
  padding:10px 20px;
  border-radius:10px;
  text-decoration:none;
}

.card {
  background:#fff;
  padding:20px;
  border-radius:15px;
  margin:10px;
  transition:.3s;
}
.card:hover { transform:translateY(-8px); }

.service-box {
  display:flex;
  flex-wrap:wrap;
  justify-content:center;
}

.project-card {
  background:#fff;
  padding:20px;
  margin:10px 0;
  border-radius:15px;
}

.contact-form {
  display:flex;
  flex-direction:column;
  gap:10px;
  max-width:400px;
  margin:auto;
}

.popup {
  display:none;
  position:fixed;
  width:100%;
  height:100%;
  background:rgba(0,0,0,0.5);
}

.popup-content {
  background:#fff;
  padding:20px;
  margin:100px auto;
  width:90%;
  max-width:400px;
  border-radius:10px;
}

.whatsapp {
  position:fixed;
  bottom:20px;
  right:20px;
  background:#25D366;
  padding:15px;
  border-radius:50%;
  color:#fff;
}

.chatbot {
  position:fixed;
  bottom:80px;
  right:20px;
  background:#000;
  color:#fff;
  padding:10px 15px;
  border-radius:20px;
}

/* Mobile */
@media(max-width:768px){
  .hero-inner { flex-direction:column; text-align:center; }
  .hero h1 { font-size:28px; }
}
