import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Users, ArrowRight, Heart, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useCartStore } from '../../store/cartStore';
import type { Kit } from '../../types/database.types';
import toast from 'react-hot-toast';

const FeaturedKits: React.FC = () => {
  const [kits, setKits] = useState<Kit[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCartStore();

  useEffect(() => {
    fetchFeaturedKits();
  }, []);

  const fetchFeaturedKits = async () => {
    try {
      // For now, we'll create some sample data since the database might not be set up
      const sampleKits: Kit[] = [
        {
          id: '1',
          title: 'Arduino Starter Kit Pro',
          description: 'Complete electronics kit with sensors, LEDs, and microcontroller for beginners',
          price: 2499,
          currency: 'INR',
          images: ['https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=500'],
          category: 'Electronics',
          difficulty: 'Beginner',
          age_group: '12-16',
          components: ['Arduino UNO', 'Breadboard', 'LEDs', 'Resistors', 'Sensors'],
          learning_outcomes: ['Circuit Building', 'Programming Basics', 'Electronics Theory'],
          estimated_hours: 20,
          rating: 4.8,
          review_count: 234,
          in_stock: true,
          course_id: 'course-1',
          tags: ['arduino', 'electronics', 'beginner'],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'Robotics Engineering Kit',
          description: 'Build and program robots with this comprehensive mechanical engineering kit',
          price: 4999,
          currency: 'INR',
          images: ['https://images.pexels.com/photos/8566473/pexels-photo-8566473.jpeg?auto=compress&cs=tinysrgb&w=500'],
          category: 'Robotics',
          difficulty: 'Intermediate',
          age_group: '14-18',
          components: ['Motors', 'Sensors', 'Chassis', 'Controller', 'Tools'],
          learning_outcomes: ['Robotics Programming', 'Mechanical Design', 'Problem Solving'],
          estimated_hours: 40,
          rating: 4.9,
          review_count: 187,
          in_stock: true,
          course_id: 'course-2',
          tags: ['robotics', 'programming', 'engineering'],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: '3',
          title: 'IoT Smart Home Kit',
          description: 'Create connected devices and learn Internet of Things with real-world applications',
          price: 3799,
          currency: 'INR',
          images: ['https://images.pexels.com/photos/8439093/pexels-photo-8439093.jpeg?auto=compress&cs=tinysrgb&w=500'],
          category: 'Electronics',
          difficulty: 'Advanced',
          age_group: '16+',
          components: ['ESP32', 'Sensors', 'Actuators', 'Display', 'Connectivity Modules'],
          learning_outcomes: ['IoT Programming', 'Cloud Integration', 'Mobile App Development'],
          estimated_hours: 35,
          rating: 4.7,
          review_count: 156,
          in_stock: true,
          course_id: 'course-3',
          tags: ['iot', 'wifi', 'smart-home', 'advanced'],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];

      setKits(sampleKits);
    } catch (error) {
      console.error('Error fetching kits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (kit: Kit) => {
    addItem(kit);
    toast.success(`${kit.title} added to cart!`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-700';
      case 'intermediate':
        return 'bg-orange-100 text-orange-700';
      case 'advanced':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-2xl"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-800 mb-4"
          >
            <Star className="h-4 w-4 mr-2" />
            Most Popular Kits
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
          >
            Featured STEM Kits
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Hand-picked kits designed by educators to provide the best learning experience
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {kits.map((kit, index) => (
            <motion.div
              key={kit.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white rounded-2xl shadow-sm border hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              <div className="relative overflow-hidden">
                <img
                  src={kit.images[0]}
                  alt={kit.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(kit.difficulty)}`}>
                    {kit.difficulty}
                  </span>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    {kit.category}
                  </span>
                </div>
                
                <button className="absolute top-4 right-4 p-2 rounded-full bg-white/90 backdrop-blur hover:bg-white transition-colors">
                  <Heart className="h-4 w-4 text-gray-600 hover:text-red-500 transition-colors" />
                </button>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">{kit.age_group} years</span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-700 ml-1">
                      {kit.rating} ({kit.review_count})
                    </span>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {kit.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {kit.description}
                </p>
                
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {kit.estimated_hours}h
                  </div>
                  <div className="flex items-center">
                    <Users className="h-3 w-3 mr-1" />
                    {kit.components.length} components
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline">
                    <span className="text-2xl font-bold text-gray-900">₹{kit.price.toLocaleString()}</span>
                    <span className="text-sm text-gray-500 ml-1">INR</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Link
                      to={`/kits/${kit.id}`}
                      className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-200 hover:border-blue-300 rounded-lg transition-colors"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => handleAddToCart(kit)}
                      className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg transition-all flex items-center"
                    >
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link
            to="/kits"
            className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-4 text-lg font-medium text-white hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105"
          >
            Explore All Kits
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedKits;