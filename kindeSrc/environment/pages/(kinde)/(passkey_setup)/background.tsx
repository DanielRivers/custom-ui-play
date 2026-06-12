"use server"
import React from "react";
import {
    getKindeNonce,
  getKindeWidget,
} from "@kinde/infrastructure";

export default function Component() {
  return (
    <div style={styles.container}>
      {/* Animated Background Animals */}
      <div style={styles.backgroundAnimals}>
        <img src="/images/cartoon-elephant.png" alt="" style={{ ...styles.animal, ...styles.elephant }} />
        <img src="/images/cartoon-monkey.png" alt="" style={{ ...styles.animal, ...styles.monkey }} />
        <img src="/images/cartoon-giraffe.png" alt="" style={{ ...styles.animal, ...styles.giraffe }} />
        <img src="/images/cartoon-rabbit.png" alt="" style={{ ...styles.animal, ...styles.rabbit }} />
        <img src="/images/cartoon-lion.png" alt="" style={{ ...styles.animal, ...styles.lion }} />
        <img src="/images/cartoon-panda.png" alt="" style={{ ...styles.animal, ...styles.panda }} />
      </div>

      {/* Content Container for Kinde Auth Form */}
      <div style={styles.contentContainer}>
        <div style={styles.authCard}>
          <div style={styles.header}>
            <h1 style={styles.title}>Welcome Back!</h1>
            <p style={styles.subtitle}>Sign in to continue your adventure</p>
          </div>

          {/* Kinde will inject their auth form here */}
          <div style={styles.kindeFormContainer}>
            {getKindeWidget()}
          </div>
        </div>
      </div>

      <style nonce={getKindeNonce()} jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-15px) scale(1.05); }
        }

        @keyframes swing {
          0%, 100% { transform: rotate(-10deg); }
          50% { transform: rotate(10deg); }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        @keyframes slideIn {
          from { 
            opacity: 0; 
            transform: translateY(30px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }

        .auth-card {
          animation: slideIn 0.8s ease-out;
        }

        /* Kinde form styling */
        :global(.kinde-form input) {
          padding: 12px 16px !important;
          border: 2px solid #e5e7eb !important;
          border-radius: 12px !important;
          font-size: 16px !important;
          transition: all 0.3s ease !important;
          outline: none !important;
          background-color: #ffffff !important;
          width: 100% !important;
          box-sizing: border-box !important;
        }

        :global(.kinde-form input:focus) {
          transform: scale(1.02) !important;
          border-color: #dc2626 !important;
          box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1) !important;
        }

        :global(.kinde-form button) {
          padding: 14px 24px !important;
          background: linear-gradient(135deg, #dc2626, #b91c1c) !important;
          color: white !important;
          border: none !important;
          border-radius: 12px !important;
          font-size: 16px !important;
          font-weight: 600 !important;
          cursor: pointer !important;
          transition: all 0.3s ease !important;
          margin-top: 10px !important;
          min-height: 50px !important;
          width: 100% !important;
        }

        :global(.kinde-form button:hover) {
          transform: translateY(-2px) !important;
          box-shadow: 0 8px 25px rgba(220, 38, 38, 0.4) !important;
          background: linear-gradient(135deg, #b91c1c, #991b1b) !important;
        }

        :global(.kinde-form button:active) {
          transform: translateY(0px) !important;
        }

        :global(.kinde-form label) {
          font-size: 14px !important;
          font-weight: 600 !important;
          color: #374151 !important;
          margin-bottom: 8px !important;
          display: block !important;
        }

        :global(.kinde-form a) {
          color: #16a34a !important;
          text-decoration: none !important;
          font-size: 14px !important;
          font-weight: 500 !important;
          transition: color 0.3s ease !important;
        }

        :global(.kinde-form a:hover) {
          color: #15803d !important;
          text-decoration: underline !important;
        }

        :global(.kinde-form .form-group) {
          margin-bottom: 20px !important;
        }

        :global(.kinde-form .error-message) {
          color: #dc2626 !important;
          font-size: 14px !important;
          margin-top: 5px !important;
        }

        :global(.kinde-form .success-message) {
          color: #16a34a !important;
          font-size: 14px !important;
          margin-top: 5px !important;
        }
      `}</style>
    </div>
  )
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #dc2626 0%, #16a34a 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    position: "relative" as const,
    overflow: "hidden",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },

  backgroundAnimals: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none" as const,
    zIndex: 1,
  },

  animal: {
    position: "absolute" as const,
    opacity: 0.7,
    filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))",
    width: "120px",
    height: "120px",
    objectFit: "contain" as const,
  },

  elephant: {
    top: "10%",
    left: "5%",
    animation: "float 3s ease-in-out infinite",
    animationDelay: "0s",
    width: "140px",
    height: "140px",
  },

  monkey: {
    top: "20%",
    right: "10%",
    animation: "swing 2s ease-in-out infinite",
    animationDelay: "0.5s",
    width: "100px",
    height: "100px",
  },

  giraffe: {
    bottom: "30%",
    left: "8%",
    animation: "bounce 2.5s ease-in-out infinite",
    animationDelay: "1s",
    width: "110px",
    height: "130px",
  },

  rabbit: {
    top: "60%",
    right: "15%",
    animation: "bounce 2.5s ease-in-out infinite",
    animationDelay: "1.5s",
    width: "90px",
    height: "90px",
  },

  lion: {
    bottom: "10%",
    right: "5%",
    animation: "pulse 2.8s ease-in-out infinite",
    animationDelay: "2s",
    width: "130px",
    height: "130px",
  },

  panda: {
    top: "45%",
    left: "3%",
    animation: "float 3s ease-in-out infinite",
    animationDelay: "2.5s",
    width: "95px",
    height: "95px",
  },

  contentContainer: {
    position: "relative" as const,
    zIndex: 10,
    width: "100%",
    maxWidth: "400px",
  },

  authCard: {
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(10px)",
    borderRadius: "20px",
    padding: "40px",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
    border: "2px solid rgba(255, 255, 255, 0.2)",
    animation: "slideIn 0.8s ease-out",
  },

  header: {
    textAlign: "center" as const,
    marginBottom: "30px",
  },

  title: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#dc2626",
    margin: "0 0 8px 0",
    textShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },

  subtitle: {
    fontSize: "16px",
    color: "#16a34a",
    margin: 0,
    fontWeight: "500",
  },

  kindeFormContainer: {
    width: "100%",
  },
}
