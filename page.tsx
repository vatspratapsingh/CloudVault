'use client';

import { useEffect, useState } from 'react';
import { Upload, Trash } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchFiles = async () => {
    try {
      const res = await fetch('http://localhost:18080/files');
      const data = await res.json();
      setFiles(data.files);
    } catch (err) {
      console.error('Fetch error', err);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const uploadFile = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    setLoading(true);
    try {
      const res = await fetch('http://localhost:18080/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('✅ Upload successful');
        fetchFiles();
        setFile(null);
      } else {
        toast.error(data.error || 'Upload failed');
      }
    } catch (err) {
      toast.error('Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const deleteFile = async (key: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;
    try {
      const res = await fetch(`http://localhost:18080/delete/${key}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        toast.success('🗑️ File deleted');
        fetchFiles();
      } else {
        toast.error('❌ Delete failed');
      }
    } catch (err) {
      toast.error('❌ Delete failed');
    }
  };

  const getIcon = (name: string) => {
    const ext = name.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext!)) return '🖼️';
    if (['pdf'].includes(ext!)) return '📄';
    if (['zip', 'rar', '7z'].includes(ext!)) return '🗜️';
    return '📁';
  };

  return (
    
    <div className="bg-animated" style={{ minHeight: '100vh', overflow: 'hidden' }}>
      <main
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(to bottom right, #1f0505ff, #191970)',            
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '2rem',
          color: '#021a03ff',
        }}
      >
        <motion.div
          style={{
            background: '#8c7cc3ff',
            border: '1px solid #0b1304ff',
            padding: '2rem',
            borderRadius: '1rem',
            boxShadow: '0 4px 12px rgba(65, 7, 7, 0.1)',
            width: '100%',
            maxWidth: '600px',
          }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 style={{ fontSize: '2rem',color: '#343434', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>
            📂 CloudVault
          </h1>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              marginBottom: '1.5rem',
            }}
          >
            <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            <button
              onClick={uploadFile}
              disabled={!file || loading}
              style={{
                backgroundColor: '#1B1212',
                color: 'white',
                fontWeight: '500',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <Upload style={{ width: '1rem', height: '1rem', marginRight: '0.5rem', display: 'inline-block' }} /> Upload
            </button>
          </div>
        </motion.div>

        <motion.div
          style={{
            background: '#1B1212',
            padding: '1.5rem',
            marginTop: '2rem',
            borderRadius: '1rem',
            boxShadow: '0 4px 12px rgba(11, 10, 10, 0.1)',
            width: '100%',
            maxWidth: '600px',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 style={{ fontSize: '1.25rem', color: '#ffffff' ,fontWeight: '600', marginBottom: '1rem' }}>📜 Uploaded Files</h2>
          {files.length === 0 ? (
            <p style={{ color: '#d0d3d9ff' }}>No files uploaded yet.</p>
          ) : (
            <ul style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {files.map((file) => (
                <li
                  key={file.key}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: '#8c7cc3ff',
                    padding: '1rem',
                    borderRadius: '0.75rem',
                    boxShadow: '0 2px 6px rgba(125, 27, 27, 0.05)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '1.25rem' }}>{getIcon(file.key)}</span>
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#12151dff', textDecoration: 'underline', wordBreak: 'break-word' }}
                    >
                      {file.key}
                    </a>
                  </div>
                  <button
                    onClick={() => deleteFile(file.key)}
                    style={{ color: '#c21717ff', background: 'transparent', border: 'none', cursor: 'pointer' }}
                  >
                    <Trash style={{ width: '1rem', height: '1rem' }} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      </main>
    </div>
  );
}