export default function mobileDetect() {
  const isAndroid = /(android)/i.test(navigator.userAgent);
  const isiPhone = !!navigator.userAgent.match(/iPhone/i);
  /*
  const getIPhoneVersion = isiPhone => {
    if (isiPhone) {
      const version = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);
      const arr = [
        parseInt(version[1], 10),
        parseInt(version[2], 10),
        parseInt(version[3] || 0, 10)
      ];
      return Number(String(arr[0]) + String(arr[1]) + String(arr[2]));
    } else {
      return -1;
    }
  };

  const iPhoneVersion = getIPhoneVersion(isiPhone);
  */
  const isMobile = isAndroid || isiPhone;

  return isMobile;
}
