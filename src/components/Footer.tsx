"use client";

import Link from "next/link";
import {
  FaPhoneAlt,
  FaWhatsapp,
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";
import { useFooterData } from "@/hooks/useFooterData";

export default function Footer() {
  const { data, loading } = useFooterData();

  if (loading) {
    return (
      <footer className="bg-gray-900 text-gray-400 py-12 text-center">
        <p>Carregando informações...</p>
      </footer>
    );
  }

  if (!data) return null;

  const { companyName, description, phone, whatsapp, email, socials = {} } = data;

  // Sanitiza o número de WhatsApp para só números
const waNumber = whatsapp ? whatsapp.trim().replace(/\D/g, "") : "";

  return (
    <footer id="contato" className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Logo + Descrição */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">
                  {companyName?.charAt(0) || "?"}
                </span>
              </div>
              <span className="text-2xl font-bold text-white">{companyName}</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed max-w-lg">
              {description}
            </p>

            {/* Redes sociais */}
            <div className="flex space-x-4">
              {socials.facebook && (
                <a href={socials.facebook} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <FaFacebookF />
                </a>
              )}
              {socials.instagram && (
                <a href={socials.instagram} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-pink-500 transition-colors">
                  <FaInstagram />
                </a>
              )}
              {socials.linkedin && (
                <a href={socials.linkedin} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-blue-500 transition-colors">
                  <FaLinkedinIn />
                </a>
              )}
              {socials.youtube && (
                <a href={socials.youtube} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-red-600 transition-colors">
                  <FaYoutube />
                </a>
              )}
            </div>
          </div>

          {/* Links úteis */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Informações</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/politicas/privacidade" 
                  className="hover:text-white transition-colors"
                >
                  Políticas de Privacidade
                </Link>
              </li>

            </ul>
          </div>

          {/* Contato */}

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contato</h3>
            <ul className="space-y-4">
              {phone && (
                <li>
                  <a
                    href={`tel:${phone}`}
                    className="flex items-center gap-3 hover:text-red-400 transition-colors"
                  >
                    <FaPhoneAlt className="text-red-500" />
                    <span>{phone}</span>
                  </a>
                </li>
              )}

              {waNumber && (
                <li>
                  <a
                    href={`https://wa.me/${waNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 hover:text-green-400 transition-colors"
                  >
                    <FaWhatsapp className="text-green-500" />
                    <span>{whatsapp}</span>
                  </a>
                </li>
              )}

              {email && (
                <li>
                  <a
                    href={`mailto:${email}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 hover:text-red-400 transition-colors"
                  >
                    <FaEnvelope className="text-red-500" />
                    <span>{email}</span>
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-500 text-sm">
          <p>
            &copy; {new Date().getFullYear()} {companyName}. Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
