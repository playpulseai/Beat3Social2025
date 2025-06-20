import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  GraduationCap, 
  Users, 
  Shield, 
  Sparkles, 
  TrendingUp,
  BookOpen,
  Award,
  Globe
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-white">
            Where <span className="text-blue-600">AI</span> Meets <span className="text-green-500">Education</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Beat3 Social is a Web3-powered platform for teachers, parents, and educators to share content, celebrate learning, and connect around all things AI and education. No fluff. Just real milestones, real students, real stories.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold">
                Get Started
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg" className="px-8 py-3 text-lg font-semibold">
                Learn More
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
          <Card className="text-center">
            <CardContent className="p-6">
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Educators</h3>
              <p className="text-gray-600 dark:text-gray-400">Connect with verified teachers</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <Brain className="w-8 h-8 text-green-500 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">AI-Powered</h3>
              <p className="text-gray-600 dark:text-gray-400">Smart content moderation</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <Shield className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Safe Space</h3>
              <p className="text-gray-600 dark:text-gray-400">Education-focused environment</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-4 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Built for Education Excellence
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Every feature designed to celebrate learning, share knowledge, and connect the education community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <GraduationCap className="w-10 h-10 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Verified Educators
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Connect with verified teachers and education professionals in a trusted environment.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Sparkles className="w-10 h-10 text-green-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  AI Integration
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Discover and share the latest AI tools and innovations transforming education.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Award className="w-10 h-10 text-purple-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Achievement Recognition
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Celebrate student milestones and educational achievements with NFT certificates.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <BookOpen className="w-10 h-10 text-amber-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Content Sharing
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Share educational content, lesson plans, and teaching resources with the community.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <TrendingUp className="w-10 h-10 text-red-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Learning Analytics
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Track educational trends and measure learning impact across the platform.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Globe className="w-10 h-10 text-cyan-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Global Community
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Join educators worldwide in shaping the future of AI-powered education.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-4 bg-gradient-to-r from-blue-600 to-green-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Education?
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of educators already using Beat3 Social to celebrate learning and share knowledge.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" variant="secondary" className="px-8 py-3 text-lg font-semibold">
                Join the Community
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="px-8 py-3 text-lg font-semibold border-white text-white hover:bg-white hover:text-blue-600">
                Sign In
              </Button>
            </Link>
          </div>
          
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              #AI
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              #Education
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              #EdTech
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              #Teaching
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              #Learning
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}