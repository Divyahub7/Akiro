import Certificate from "../models/Certificate.js";

export const addCertificate = async (req, res) => {
  try {
    const { title, issuingOrganization, issueDate, expiryDate, credentialUrl } =
      req.body;
    const certificate = await Certificate.create({
      userId: req.user.id,
      title,
      issuingOrganization,
      issueDate,
      expiryDate,
      credentialUrl,
    });
    res.status(201).json(certificate);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getCertificate = async (req, res) => {
  try {
    const certificates = await Certificate.find({
      userId: req.user.id,
    }).sort({ issueDate: -1 });
    res.status(200).json(certificates);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.id,
      },
      req.body,
      { new: true, runValidators: true },
    );
    if (!certificate)
      return res.status(404).json({ message: "Certificate not found!" });
    res.status(200).json(certificate);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!certificate)
      return res.status(404).json({ message: "Certificate not found!" });
    res.status(200).json({ message: "Certificate deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
