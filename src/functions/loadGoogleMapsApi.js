// googleMapsApi.js
const loadGoogleMapsAPI = (onLoadCallback) => {
    if (!document.querySelector('script[src*="maps.googleapis.com"]')) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDyeGT5c3ppuKJZvaFvMnbzHQVeLi1c9j8&libraries=places`;
      script.async = true;
      script.defer = true;
  
      script.onload = () => {
        console.log("Google Maps API script loaded successfully!");
        onLoadCallback(); // Initialize autocomplete after script loads
      };
  
      script.onerror = (error) => {
        console.error("Error loading the Google Maps API script:", error);
      };
  
      document.head.appendChild(script);
    } else {
      onLoadCallback(); // If script is already loaded, initialize autocomplete
    }
  };
  
  export default loadGoogleMapsAPI;