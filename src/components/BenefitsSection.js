import React from 'react';
import { motion } from 'framer-motion';
import '../styles/BenefitsSection.css';

function BenefitsSection() {
  // Define the animation for the benefit items
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="benefits-section">
      <h2 className="section-title">Why Choose Our Platform?</h2>
      <div className="benefit-list">
        <motion.div 
          className="benefit-item" 
          variants={itemVariants} 
          initial="hidden" 
          animate="visible"
        >
          <h3>Cost Savings</h3>
          <p>
            Reduce your shipping expenses by up to 70% with our exclusive discounted rates. 
            Designed to help businesses maximize profitability, our platform ensures you get 
            the best value for your shipments.
          </p>
        </motion.div>

        <motion.div 
          className="benefit-item" 
          variants={itemVariants} 
          initial="hidden" 
          animate="visible"
          transition={{ delay: 0.2 }} // Add delay for staggered effect
        >
          <h3>Reliable Shipping</h3>
          <p>
            Ensure your shipments reach their destination on time with our trusted network 
            of carriers. Our platform prioritizes accuracy and reliability, giving you peace 
            of mind for every delivery.
          </p>
        </motion.div>

        <motion.div 
          className="benefit-item" 
          variants={itemVariants} 
          initial="hidden" 
          animate="visible"
          transition={{ delay: 0.4 }} // Add delay for staggered effect
        >
          <h3>Easy to Use</h3>
          <p>
            Our streamlined platform simplifies the process of calculating shipping rates. 
            With a focus on speed and efficiency, it’s designed to provide a hassle-free experience 
            for e-commerce businesses of all sizes.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export default BenefitsSection;

