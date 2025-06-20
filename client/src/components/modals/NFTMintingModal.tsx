import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Wallet, AlertTriangle } from "lucide-react";
import { ModalProps, NFTMintData } from "@/types";

const NFTMintingModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const { userData } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState<NFTMintData>({
    title: "",
    description: "",
    type: "test-score",
    metadata: {},
  });
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isWalletConnected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to mint NFTs",
        variant: "destructive",
      });
      return;
    }

    if (!formData.title.trim() || !formData.description.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Implement NFT minting logic when smart contract is ready
      // For now, just show success message
      toast({
        title: "NFT Minting Prepared",
        description: "Your NFT data has been prepared. Smart contract integration coming soon!",
      });

      // Reset form
      setFormData({
        title: "",
        description: "",
        type: "test-score",
        metadata: {},
      });
      onClose();
    } catch (error) {
      console.error("Error preparing NFT:", error);
      toast({
        title: "Error",
        description: "Failed to prepare NFT. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConnectWallet = () => {
    // TODO: Implement wallet connection logic
    // For now, just simulate connection
    setIsWalletConnected(true);
    toast({
      title: "Wallet Connected",
      description: "Your wallet has been connected successfully",
    });
  };

  const achievementTypes = [
    {
      value: "test-score",
      label: "Test Score",
      description: "Mint student test results",
    },
    {
      value: "certificate",
      label: "Certificate",
      description: "Academic achievement certificate",
    },
    {
      value: "milestone",
      label: "Milestone",
      description: "Learning milestone or award",
    },
  ];

  const fees = {
    baseFee: 0.005,
    platformFee: 0.002,
    gasFee: 0.003,
    total: 0.010,
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Mint Educational NFT</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Achievement Type Selection */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Achievement Type</Label>
            <RadioGroup
              value={formData.type}
              onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as any }))}
            >
              {achievementTypes.map((type) => (
                <div key={type.value} className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                  <RadioGroupItem value={type.value} id={type.value} />
                  <div className="flex-1">
                    <Label htmlFor={type.value} className="font-medium cursor-pointer">
                      {type.label}
                    </Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{type.description}</p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Achievement Details */}
          <div>
            <Label htmlFor="title" className="text-sm font-medium mb-2 block">
              Achievement Title *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Perfect Score in Math Quiz"
              required
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-sm font-medium mb-2 block">
              Description *
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the achievement..."
              className="min-h-[80px] resize-none"
              required
            />
          </div>

          {/* Wallet Connection */}
          <Alert className="bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800">
            <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            <AlertDescription className="text-yellow-800 dark:text-yellow-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium mb-1">Wallet Required</p>
                  <p className="text-sm">Connect your wallet to mint NFTs (MetaMask, Foxfire, etc.)</p>
                </div>
                {!isWalletConnected && (
                  <Button
                    type="button"
                    onClick={handleConnectWallet}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white"
                  >
                    <Wallet className="w-4 h-4 mr-2" />
                    Connect
                  </Button>
                )}
              </div>
              {isWalletConnected && (
                <p className="text-green-600 dark:text-green-400 mt-2 text-sm font-medium">
                  ✓ Wallet Connected
                </p>
              )}
            </AlertDescription>
          </Alert>

          {/* Fee Breakdown */}
          <Card className="bg-gray-50 dark:bg-gray-800">
            <CardContent className="p-4">
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Minting Fees</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Base Minting Fee:</span>
                  <span className="text-gray-900 dark:text-gray-100">{fees.baseFee} ETH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Platform Fee:</span>
                  <span className="text-gray-900 dark:text-gray-100">{fees.platformFee} ETH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Gas Fee (Est.):</span>
                  <span className="text-gray-900 dark:text-gray-100">{fees.gasFee} ETH</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-600 pt-2 mt-2">
                  <div className="flex justify-between font-medium">
                    <span className="text-gray-900 dark:text-gray-100">Total:</span>
                    <span className="text-gray-900 dark:text-gray-100">{fees.total} ETH</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.title.trim() || !formData.description.trim()}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
            >
              {isSubmitting ? "Preparing..." : "Mint NFT"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NFTMintingModal;
