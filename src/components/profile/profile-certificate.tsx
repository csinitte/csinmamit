import Image from "next/image";
import MaxWidthWrapper from "~/components/layout/max-width-wrapper";
import { useAuth } from "~/lib/firebase-auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "~/lib/firebase-auth";
import { useState, useEffect } from "react";

const Certificates = () => {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load user certificates from Firestore
  useEffect(() => {
    const loadCertificates = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        const db = getFirestore(app);
        const userDoc = await getDoc(doc(db, 'users', user.id));
        
        if (userDoc.exists()) {
          const data = userDoc.data();
          setCertificates(data.certificates || []);
        }
      } catch (error) {
        console.error('Error loading certificates:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCertificates();
  }, [user?.id]);

  if (isLoading) {
    return (
      <MaxWidthWrapper className="mb-12 mt-9 flex flex-col items-center justify-center text-center sm:mt-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading certificates...</p>
        </div>
      </MaxWidthWrapper>
    );
  }

  return (
    <MaxWidthWrapper className="mb-12 mt-9 flex flex-col items-center justify-center text-center sm:mt-12">
      <h1
        className={`bg-gradient-to-b from-blue-600 to-violet-400 bg-clip-text pb-4 text-center text-4xl font-black text-transparent`}
      >
        Certificates
      </h1>

      {certificates.length === 0 ? (
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-lg">No certificates available yet.</p>
          <p className="text-gray-400 text-sm mt-2">Certificates will appear here once they are added to your profile.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-5">
          {certificates.map((certificateUrl, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200"
            >
              <Image
                src={certificateUrl}
                alt={`Certificate ${index + 1}`}
                width={500}
                height={500}
                className="w-full h-auto object-cover"
                onError={(e) => {
                  // Fallback to default certificate image if URL fails
                  const target = e.target as HTMLImageElement;
                  target.src = "/certi.png";
                }}
              />
            </div>
          ))}
        </div>
      )}
    </MaxWidthWrapper>
  );
};

export default Certificates;
