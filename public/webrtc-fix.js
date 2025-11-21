// WebRTC обход блокировки VoIP в РФ
(function() {
  console.log('🛡️ WebRTC VoIP Fix activated');
  
  // Перехватываем создание RTCPeerConnection
  const OriginalRTCPeerConnection = window.RTCPeerConnection;
  
  window.RTCPeerConnection = function(configuration) {
    console.log('🎯 Intercepting RTCPeerConnection creation');
    
    if (configuration && configuration.iceServers) {
      // Добавляем рабочие TURN серверы
      const customIceServers = [
        {
          urls: [
            'turn:turn.anyfirewall.com:443?transport=tcp',
            'turn:turn.anyfirewall.com:3478?transport=udp'
          ],
          username: 'webrtc',
          credential: 'webrtc'
        },
        {
          urls: 'turn:numb.viagenie.ca:3478',
          username: 'username', 
          credential: 'password'
        }
      ];
      
      configuration.iceServers = [...customIceServers, ...configuration.iceServers];
      configuration.iceTransportPolicy = 'relay';
      
      console.log('✅ Modified ICE servers:', configuration.iceServers);
    }
    
    return new OriginalRTCPeerConnection(configuration);
  };
  
  // Сохраняем оригинальные методы
  window.RTCPeerConnection.prototype = OriginalRTCPeerConnection.prototype;
})();
