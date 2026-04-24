import { GoogleMap, useJsApiLoader, OverlayViewF } from "@react-google-maps/api";
import { TentIcon } from "lucide-react";
import { useState } from "react";

import { PageLoader } from "@/components/loader";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/sheet";

export type Campsite = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  description: string;
};

type HomePageProps = {
  campsites: Campsite[];
};

export const HomePage = ({ campsites }: HomePageProps) => {
  const [selectedCampsite, setSelectedCampsite] = useState<Campsite | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY
  });

    if (!isLoaded) return <PageLoader />

  return (
    <div className="w-full h-full rounded-xl overflow-hidden border relative bg-muted">
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={{ lat: 39.8283, lng: -98.5795 }}
        zoom={4}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
        }}
      >
        {campsites.map((campsite) => (
          <OverlayViewF
            key={campsite.id}
            position={{ lat: campsite.lat, lng: campsite.lng }}
            mapPaneName="overlayMouseTarget"
          >
            <button
              type="button"
              onClick={() => setSelectedCampsite(campsite)}
              className="bg-primary text-primary-foreground p-2 rounded-full shadow-md cursor-pointer hover:scale-110 transition-transform -translate-x-1/2 -translate-y-1/2 border-none"
            >
              <TentIcon className="w-5 h-5" />
            </button>
          </OverlayViewF>
        ))}
      </GoogleMap>
      {!!selectedCampsite && <Sheet
        open={true}
        onOpenChange={(open) => {
          if (!open) setSelectedCampsite(null);
        }}
      >
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{selectedCampsite.name}</SheetTitle>
            <SheetDescription>
              {selectedCampsite.description}
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>}
    </div>
  );
};
