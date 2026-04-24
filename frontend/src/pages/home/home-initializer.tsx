import { Page } from "@/app/layouts/page-layouts/page";
import { HomePage, type Campsite } from "@/pages/home/home-page";

const MOCK_COASTAL_CAMPSITES: Campsite[] = [
  { id: 'wa', name: 'Washington Coast Camp', lat: 47.75, lng: -120.74, description: 'Beautiful WA coast' },
  { id: 'or', name: 'Oregon Coast Camp', lat: 43.8, lng: -120.55, description: 'Beautiful OR coast' },
  { id: 'ca', name: 'California Coast Camp', lat: 36.77, lng: -119.41, description: 'Beautiful CA coast' },
  { id: 'tx', name: 'Texas Gulf Camp', lat: 31.96, lng: -99.9, description: 'Beautiful TX coast' },
  { id: 'la', name: 'Louisiana Gulf Camp', lat: 31.16, lng: -91.86, description: 'Beautiful LA coast' },
  { id: 'ms', name: 'Mississippi Gulf Camp', lat: 32.35, lng: -89.39, description: 'Beautiful MS coast' },
  { id: 'al', name: 'Alabama Gulf Camp', lat: 32.31, lng: -86.9, description: 'Beautiful AL coast' },
  { id: 'fl', name: 'Florida Coast Camp', lat: 27.99, lng: -81.76, description: 'Beautiful FL coast' },
  { id: 'ga', name: 'Georgia Coast Camp', lat: 32.16, lng: -82.9, description: 'Beautiful GA coast' },
  { id: 'sc', name: 'South Carolina Coast Camp', lat: 33.83, lng: -81.16, description: 'Beautiful SC coast' },
  { id: 'nc', name: 'North Carolina Coast Camp', lat: 35.75, lng: -79.01, description: 'Beautiful NC coast' },
  { id: 'va', name: 'Virginia Coast Camp', lat: 37.43, lng: -78.65, description: 'Beautiful VA coast' },
  { id: 'md', name: 'Maryland Coast Camp', lat: 39.04, lng: -76.64, description: 'Beautiful MD coast' },
  { id: 'de', name: 'Delaware Coast Camp', lat: 38.91, lng: -75.52, description: 'Beautiful DE coast' },
  { id: 'nj', name: 'New Jersey Coast Camp', lat: 40.05, lng: -74.4, description: 'Beautiful NJ coast' },
  { id: 'ny', name: 'New York Coast Camp', lat: 43.29, lng: -75.52, description: 'Beautiful NY coast' },
  { id: 'ct', name: 'Connecticut Coast Camp', lat: 41.59, lng: -72.75, description: 'Beautiful CT coast' },
  { id: 'ri', name: 'Rhode Island Coast Camp', lat: 41.58, lng: -71.47, description: 'Beautiful RI coast' },
  { id: 'ma', name: 'Massachusetts Coast Camp', lat: 42.4, lng: -71.38, description: 'Beautiful MA coast' },
  { id: 'nh', name: 'New Hampshire Coast Camp', lat: 43.19, lng: -71.57, description: 'Beautiful NH coast' },
  { id: 'me', name: 'Maine Coast Camp', lat: 45.25, lng: -69.44, description: 'Beautiful ME coast' },
  { id: 'ak', name: 'Alaska Coast Camp', lat: 64.2, lng: -149.49, description: 'Beautiful AK coast' },
  { id: 'hi', name: 'Hawaii Coast Camp', lat: 19.89, lng: -155.58, description: 'Beautiful HI coast' },
];

export const HomeInitializer = () => {

  return (
    <Page loading={false} title="Explore">
      <HomePage campsites={MOCK_COASTAL_CAMPSITES} />
    </Page>
  );
};
