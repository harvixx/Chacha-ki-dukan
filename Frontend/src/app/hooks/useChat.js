import { useState, useEffect, useCallback, useRef } from 'react';
import { initiateSocketConnection, disconnectSocket } from '../services/chat.socket.js';

export const useChat = (userId, sellerId, productId) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentOffer, setCurrentOffer] = useState(0);
  const [chachaTyping, setChachaTyping] = useState(false);
  const [gameState, setGameState] = useState(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [errorStatus, setErrorStatus] = useState(null);
  const [dealResult, setDealResult] = useState(null);
  const [walkAwayResult, setWalkAwayResult] = useState(null);

  const socketRef = useRef(null);

  useEffect(() => {
    const s = initiateSocketConnection();
    setSocket(s);
    socketRef.current = s;

    if (userId) {
      s.emit('start_game', { userId, sellerId, productId });
    }

    s.on('game_started', (data) => {
      setMessages([{ role: 'assistant', content: data.message }]);
      // Backend se data.gameState.sellerName aana chahiye
      setGameState(data.gameState);
      if (data.gameState) {
        setCurrentOffer(data.gameState.currentOffer);
      }
    });

    s.on('chacha_response', (data) => {
      setMessages((prev) => [...prev, { role: 'assistant', content: data.message }]);
      setGameState(data.gameState);
      if (data.gameState) {
        setCurrentOffer(data.gameState.currentOffer);
      }
      if (data.gameOver) {
        setIsGameOver({ status: data.reason });
      }
      setChachaTyping(false);
    });

    s.on('chacha_typing', (isTyping) => {
      setChachaTyping(isTyping);
    });

    s.on('deal_result', (data) => {
      setDealResult(data);
      setIsGameOver({ status: 'deal' });
    });

    s.on('walk_away_result', (data) => {
      setWalkAwayResult(data);
      setIsGameOver({ status: 'walkaway' });
    });

    s.on('error', (err) => {
      setErrorStatus(err.message);
      setChachaTyping(false);
      setTimeout(() => setErrorStatus(null), 5000);
    });

    return () => {
      s.off('game_started');
      s.off('chacha_response');
      s.off('chacha_typing');
      s.off('deal_result');
      s.off('walk_away_result');
      s.off('error');
      disconnectSocket();
    };
  }, [userId, sellerId, productId]);

  const sendMessage = useCallback((text) => {
    const s = socketRef.current;
    if (s && text.trim()) {
      setMessages((prev) => [...prev, { role: 'user', content: text }]);
      setChachaTyping(true);
      s.emit('send_message', text);
    }
  }, []);

  const acceptDeal = useCallback((playerName, sellerName) => {
    const s = socketRef.current;
    if (s) {
      // Yahan ensure karo ki agar sellerName argument khali hai toh gameState se uthaye
      const sName = sellerName || gameState?.sellerName || 'Dukandar';
      s.emit('deal_accepted', {
        userId,
        playerName: playerName || 'Player',
        sellerName: sName,
      });
    }
  }, [userId, gameState]);

  const walkAway = useCallback((sellerName) => {
    const s = socketRef.current;
    if (s) {
      const sName = sellerName || gameState?.sellerName || 'Dukandar';
      s.emit('walk_away', {
        userId,
        sellerName: sName,
      });
    }
  }, [userId, gameState]);

  return {
    messages,
    currentOffer,
    chachaTyping,
    gameState,
    isGameOver,
    errorStatus,
    dealResult,
    walkAwayResult,
    sendMessage,
    acceptDeal,
    walkAway,
  };
};