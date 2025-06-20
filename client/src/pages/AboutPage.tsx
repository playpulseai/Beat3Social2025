import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  Brain, 
  Shield, 
  Globe, 
  Award, 
  Users, 
  Sparkles,
  BookOpen,
  Target,
  Heart,
  Zap
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-green-500 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-6 text-white">
            About Beat3 Social
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Where AI meets education. A next-generation platform reimagining social media as a space where learning is the trend.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Mission</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Target className="w-6 h-6 text-blue-600" />
                  What We Do
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Beat3 Social is a next-generation platform where educators, parents, and AI advocates come together to spotlight academic growth, educational moments, and digital creativity. We are reimagining social media as a space where learning is the trend.
                </p>
              </CardContent>
            </Card>

            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Heart className="w-6 h-6 text-green-500" />
                  Why We Exist
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Our mission is to create a safe, smart, and empowering environment for teachers and families to connect over school wins, projects, and new AI tools in education. Every post is about growth, knowledge, and possibility.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Core Values */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Our Core Values
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="text-center">
                <CardContent className="p-6">
                  <BookOpen className="w-10 h-10 text-blue-600 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Education First
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    If it's not about AI or education, it doesn't belong. That's the Beat3 Social standard.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <Shield className="w-10 h-10 text-green-500 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Safe Environment
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Strict moderation and verification ensure a trusted space for educators and families.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <Sparkles className="w-10 h-10 text-purple-600 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Innovation Driven
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Powered by AI and backed by Web3 technology when it enhances the learning experience.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Technology Stack */}
          <Card className="mb-16">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Zap className="w-6 h-6 text-amber-500" />
                Built with Modern Technology
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                Built with Firebase, powered by AI, and backed by Web3 (but only when needed), our platform supports image and video uploads, tokenized recognition of achievements, and strict moderation to keep the focus on learning.
              </p>
              <div className="flex flex-wrap gap-3">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  React & TypeScript
                </Badge>
                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Firebase
                </Badge>
                <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                  AI Moderation
                </Badge>
                <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                  Web3 Integration
                </Badge>
                <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                  NFT Certificates
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Community Standards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-blue-600" />
                  Who We Serve
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-green-700 border-green-300">Teachers</Badge>
                  <span className="text-gray-600 dark:text-gray-400">Verified educators sharing knowledge</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-blue-700 border-blue-300">Parents</Badge>
                  <span className="text-gray-600 dark:text-gray-400">Families celebrating learning moments</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-purple-700 border-purple-300">Educators</Badge>
                  <span className="text-gray-600 dark:text-gray-400">Education professionals and advocates</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-amber-700 border-amber-300">AI Advocates</Badge>
                  <span className="text-gray-600 dark:text-gray-400">Technology enthusiasts in education</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Award className="w-6 h-6 text-green-500" />
                  What We Celebrate
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span className="text-gray-600 dark:text-gray-400">Real milestones and achievements</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-gray-600 dark:text-gray-400">Innovative teaching methods</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  <span className="text-gray-600 dark:text-gray-400">AI tools transforming education</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                  <span className="text-gray-600 dark:text-gray-400">Student creativity and growth</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  <span className="text-gray-600 dark:text-gray-400">Educational technology breakthroughs</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Join the Movement?
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Be part of a community that's reshaping how we share, celebrate, and advance education through technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                  Get Started Today
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" size="lg" className="px-8 py-3">
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}