const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const PDFDocument = require('pdfkit');
const { getImageData } = require('image-size');
const nodemailer = require('nodemailer');
const app = express();
const PORT = 5000;

app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/templates', express.static(path.join(__dirname, 'templates')));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage: storage });
app.use(express.json());

// Route pour uploader des fichiers CV et photo
app.post('/upload', upload.fields([{ name: 'cv' }, { name: 'photo' }]), (req, res) => {
  const cvPath = req.files['cv'] ? req.files['cv'][0].path : null;
  const photoPath = req.files['photo'] ? req.files['photo'][0].path : null;
  res.json({ cvPath, photoPath });
});

// Route pour uploader des fichiers rapport
app.post('/uploadRapport', upload.fields([{ name: 'rapport' }]), (req, res) => {
  const rapportPath = req.files['rapport'] ? req.files['rapport'][0].path : null;
  res.json({ rapportPath });
});

// Route pour ajouter un stagiaire dans db.json
app.post('/addStagiaire', (req, res) => {
  const stagiaireData = req.body;

  fs.readFile('db.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors de la lecture du fichier JSON.' });
    }

    try {
      const jsonData = JSON.parse(data);
      jsonData.stagiairesInfo = jsonData.stagiairesInfo || [];
      jsonData.stagiairesInfo.push(stagiaireData);

      fs.writeFile('db.json', JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
        if (err) {
          return res.status(500).json({ error: 'Erreur lors de la mise à jour du fichier JSON.' });
        }
        res.json({ message: 'Stagiaire ajouté avec succès!' });
      });
    } catch (parseError) {
      res.status(500).json({ error: 'Erreur lors du parsing du fichier JSON.' });
    }
  });
});

// Route pour télécharger une attestation personnalisée
// Route pour télécharger une attestation personnalisée
app.get('/download-attestation/:stagiaireId', async (req, res) => {
  const stagiaireId = req.params.stagiaireId;

  try {
    // Lire le fichier JSON
    const data = await fs.promises.readFile('db.json', 'utf8');
    const jsonData = JSON.parse(data);

    // Trouver le stagiaire
    const stagiaire = jsonData.stagiairesInfo.find(s => s.id === stagiaireId);

    if (!stagiaire) {

      return res.status(404).send('Stagiaire non trouvé');
    }

  

    // Créer un nouveau PDF
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const fileName = `attestation-${stagiaire.nom}.pdf`;

    // Définir les en-têtes pour le téléchargement
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', 'application/pdf');

    // Envoyer le PDF directement dans la réponse HTTP
    doc.pipe(res);

    // Ajouter un arrière-plan blanc avec une bordure
    doc.rect(0, 0, 595.28, 841.89).fill('#FFFFFF'); // Fond blanc
    doc.rect(20, 20, 555.28, 801.89).stroke(); // Bordure noire

    // Ajouter une image centrée en haut
    const imagePath = path.join(__dirname, 'public', 'rom.jpg');
    doc.image(imagePath, {
      fit: [100, 100],
      align: 'center',
      valign: 'center',
      x: 247.5, // Centrer horizontalement
      y: 30 // Position verticale
    });

    // Ajouter du texte
    doc.moveDown(10); // Ajouter un espace sous l'image
    doc.fontSize(26).font('Helvetica-Bold').fillColor('black').text('CERTIFICAT DE COMPLÉTION DE STAGE', {
      align: 'center'
    });

    doc.moveDown(2).fontSize(20).font('Helvetica').text('FIÈREMENT PRÉSENTÉ À', { align: 'center' });
    doc.moveDown(1.5).fontSize(22).font('Helvetica-Bold').text(`${stagiaire.nom} ${stagiaire.prenom}`, { align: 'center' });
    doc.moveDown(1.5).fontSize(16).text('En reconnaissance de ses efforts exceptionnels et de sa réussite dans le cadre de son stage à la Province de Berkane.', { align: 'center', lineGap: 6 });
    
    // Ajouter la période de stage
    doc.moveDown(1.5).fontSize(16).text(`PÉRIODE DE STAGE: ${stagiaire.startDate} - ${stagiaire.endDate}`, { align: 'center' });
    
    // Ajouter la date d'attribution
    doc.moveDown(1.5).fontSize(16).text(`Attribué ce ${new Date().toLocaleDateString()} à la Province de Berkane.`, { align: 'center' });

    // Ajouter un espace pour la signature
    doc.moveDown(8).fontSize(16).text('Signature:', { align: 'right' });
    doc.moveDown().fontSize(16).text('_____________________', { align: 'right' });

    // Finaliser le PDF
    doc.end();

  } catch (err) {
    res.status(500).send('Erreur lors de la génération de l\'attestation.');
  }
});

//envoyer email
app.post('/send-attestation', async (req, res) => {
  const { email, nom, prenom, stagiaireId } = req.body;

  try {
    // Lire le fichier JSON pour récupérer les informations du stagiaire
    const data = await fs.promises.readFile('db.json', 'utf8');
    const jsonData = JSON.parse(data);
    const stagiaire = jsonData.stagiairesInfo.find(s => s.id === stagiaireId);

    if (!stagiaire) {
      return res.status(404).send('Stagiaire non trouvé');
    }

    // Générer le PDF
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const fileName = `attestation-${stagiaire.nom}.pdf`;
    const filePath = path.join(__dirname, 'uploads', fileName);

    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    // Ajouter le contenu du PDF
    doc.rect(0, 0, 595.28, 841.89).fill('#FFFFFF');
    doc.rect(20, 20, 555.28, 801.89).stroke();
    doc.image(path.join(__dirname, 'public', 'rom.jpg'), {
      fit: [100, 100],
      align: 'center',
      valign: 'center',
      x: 247.5,
      y: 30
    });

    doc.moveDown(10);
    doc.fontSize(26).font('Helvetica-Bold').fillColor('black').text('CERTIFICAT DE COMPLÉTION DE STAGE', { align: 'center' });
    doc.moveDown(2).fontSize(20).font('Helvetica').text('FIÈREMENT PRÉSENTÉ À', { align: 'center' });
    doc.moveDown(1.5).fontSize(22).font('Helvetica-Bold').text(`${stagiaire.nom} ${stagiaire.prenom}`, { align: 'center' });
    doc.moveDown(1.5).fontSize(16).text('En reconnaissance de ses efforts exceptionnels et de sa réussite dans le cadre de son stage à la Province de Berkane.', { align: 'center', lineGap: 6 });
    doc.moveDown(1.5).fontSize(16).text(`PÉRIODE DE STAGE: ${stagiaire.startDate} - ${stagiaire.endDate}`, { align: 'center' });
    doc.moveDown(1.5).fontSize(16).text(`Attribué ce ${new Date().toLocaleDateString()} à la Province de Berkane.`, { align: 'center' });
    doc.moveDown(8).fontSize(16).text('Signature:', { align: 'right' });
    doc.moveDown().fontSize(16).text('_____________________', { align: 'right' });

    // Finaliser le PDF
    doc.end();

    // Attendre que le PDF soit complètement écrit sur le disque
    writeStream.on('finish', () => {
      // Configurer Nodemailer
      let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'abderrahimouahab5@gmail.com',
          pass:  'rkbw nkbg reqz efun'
        },
        debug: true,
      });

      // Envoyer l'e-mail avec l'attachement
      let mailOptions = {
        from: 'abderrahimouahab5@gmail.com',
        to: email,
        subject: 'Félicitations pour la réussite de votre stage',
        text: `Cher/Chère ${nom} ${prenom}, félicitations pour la réussite de votre stage. Vous trouverez en pièce jointe votre attestation.`,
        attachments: [{
          filename: fileName,
          path: filePath
        }]
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
        
          return res.status(500).send('Erreur lors de l\'envoi de l\'e-mail.');
        }
      
        res.status(200).send('Email envoyé: ' + info.response);
      });
    });
  } catch (err) {
 
    res.status(500).send('Erreur lors de la génération de l\'attestation.');
  }
});






// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
