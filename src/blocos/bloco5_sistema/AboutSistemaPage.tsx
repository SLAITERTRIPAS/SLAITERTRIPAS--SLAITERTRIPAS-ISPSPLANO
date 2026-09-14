import React from "react";
import SobreSistemaView from "./SobreSistemaView";
import { User, ArrowLeft, Info, CheckSquare, Clock } from "lucide-react";

export default function AboutSistemaPage({
  user,
  showOwnerDetails,
  setShowOwnerDetails,
  ownerPhoto,
  ownerName,
  ownerCargo,
  itEmail,
  itWhatsapp,
  itLinkedin,
  colaboradores,
  setActiveItem
}: any) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-8 space-y-6">
        <SobreSistemaView />
        
        {/* Activity log ... */}
      </div>
      <div className="lg:col-span-4 space-y-6">
          {/* Owner details ... */}
      </div>
    </div>
  );
}
