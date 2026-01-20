import React from 'react';
import { useLocation, useNavigate, Link, useSearchParams } from 'react-router-dom';
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

// IMPORT SEMUA FORM
import FormDomisili from "./Form/FormDomisili";
import FormSKTM from "./Form/FormSKTM";
import FormKelahiran from "./Form/FormKelahiran";
import FormKematian from "./Form/FormKematian";
import FormBelumNikah from "./Form/FormBelumNikah";
import FormImunasiCatin from "./Form/FormImunasiCatin";
import FormKehilangan from "./Form/FormKehilangan";
import FormSKU from "./Form/FormSKU";
import FormKeramaian from "./Form/FormKeramaian";
import FormNA from "./Form/FormNA";
import FormSKCK from "./Form/FormSKCK";
import FormTMI from "./Form/FormTMI";

export default function FormulirSurat() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Ambil data 'type' dari URL (contoh: /formulir-surat?type=domisili)
  const jenisSurat = searchParams.get("type");

  const renderForm = () => {
    switch (jenisSurat) {
      case 'domisili': return <FormDomisili />;
      case 'sktm': return <FormSKTM />;
      case 'kelahiran': return <FormKelahiran />;
      case 'kematian': return <FormKematian />;
      case 'belum-pernah-menikah': return <FormBelumNikah />;
      case 'imunisasi-catin': return <FormImunasiCatin />;
      case 'kehilangan': return <FormKehilangan />;
      case 'sku': return <FormSKU />;
      case 'izin-keramaian': return <FormKeramaian />;
      case 'nikah': return <FormNA />;
      case 'skck': return <FormSKCK />;
      case 'ijazah': return <FormTMI />;

      default:
        return (
          <div className="max-w-4xl mx-auto bg-white p-12 rounded-3xl shadow-sm border border-slate-200 text-center">
            <h2 className="text-xl font-bold text-slate-800 mb-2">Pilih Jenis Surat Dahulu</h2>
            <p className="text-slate-500 mb-6 text-sm">Sistem tidak menemukan jenis surat yang Anda maksud.</p>
            <Link to="/buat-surat" className="bg-[#1E3A8A] text-white px-8 py-3 rounded-xl font-bold inline-block">
              Kembali ke Buat Surat
            </Link>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-12">
        <button 
          onClick={() => navigate('/buat-surat')} 
          className="flex items-center gap-2 text-slate-500 hover:text-[#1E3A8A] transition-colors mb-8 font-bold text-sm uppercase tracking-wider"
        >
          ← Kembali Pilih Surat
        </button>
        
        {/* Render form berdasarkan parameter type */}
        {renderForm()}
      </main>
      <Footer />
    </div>
  );
}