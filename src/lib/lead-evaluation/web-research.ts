import type { ContactFormData } from '../types/contact-form';

export interface WebPresenceScore {
  overallScore: number; // 0-100
  hasWebsite: boolean;
  hasSocialMedia: boolean;
  websiteAnalysis?: {
    isAccessible: boolean;
    hasSSL: boolean;
    estimatedAge?: string;
    error?: string;
  };
  socialAnalysis: {
    platform: string;
    url: string;
    isValid: boolean;
  }[];
  establishmentIndicators: {
    score: number;
    factors: string[];
  };
  digitalMaturity: 'Low' | 'Medium' | 'High';
  recommendations: string[];
}

/**
 * Analyze website presence and accessibility
 */
export async function analyzeWebsite(url: string): Promise<{
  isAccessible: boolean;
  hasSSL: boolean;
  statusCode?: number;
  error?: string;
}> {
  try {
    // Basic validation
    if (!url || url === '') {
      return { isAccessible: false, hasSSL: false, error: 'No website provided' };
    }

    const urlObj = new URL(url);
    const hasSSL = urlObj.protocol === 'https:';

    // Attempt to fetch the website with a timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
      const response = await fetch(url, {
        method: 'HEAD',
        signal: controller.signal,
        redirect: 'follow',
      });
      
      clearTimeout(timeoutId);

      return {
        isAccessible: response.ok,
        hasSSL,
        statusCode: response.status,
      };
    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      // Try to get more specific error
      if (fetchError instanceof Error) {
        if (fetchError.name === 'AbortError') {
          return { isAccessible: false, hasSSL, error: 'Request timeout' };
        }
        return { isAccessible: false, hasSSL, error: fetchError.message };
      }
      
      return { isAccessible: false, hasSSL, error: 'Connection failed' };
    }
  } catch (error) {
    return { 
      isAccessible: false, 
      hasSSL: false, 
      error: error instanceof Error ? error.message : 'Invalid URL',
    };
  }
}

/**
 * Validate and categorize social media links
 */
export function analyzeSocialMedia(socialLinks?: Array<{ url: string }>): {
  platform: string;
  url: string;
  isValid: boolean;
}[] {
  if (!socialLinks || socialLinks.length === 0) {
    return [];
  }

  return socialLinks.map(link => {
    const url = link.url.toLowerCase();
    let platform = 'Unknown';

    if (url.includes('facebook.com') || url.includes('fb.com')) {
      platform = 'Facebook';
    } else if (url.includes('twitter.com') || url.includes('x.com')) {
      platform = 'Twitter/X';
    } else if (url.includes('linkedin.com')) {
      platform = 'LinkedIn';
    } else if (url.includes('instagram.com')) {
      platform = 'Instagram';
    } else if (url.includes('youtube.com') || url.includes('youtu.be')) {
      platform = 'YouTube';
    } else if (url.includes('tiktok.com')) {
      platform = 'TikTok';
    } else if (url.includes('pinterest.com')) {
      platform = 'Pinterest';
    }

    // Basic URL validation
    const isValid = /^https?:\/\/.+/.test(link.url);

    return { platform, url: link.url, isValid };
  });
}

/**
 * Calculate establishment indicators based on digital presence
 */
function calculateEstablishmentScore(
  hasWebsite: boolean,
  websiteAnalysis: WebPresenceScore['websiteAnalysis'],
  socialAnalysis: WebPresenceScore['socialAnalysis']
): { score: number; factors: string[] } {
  let score = 0;
  const factors: string[] = [];

  // Website presence (40 points)
  if (hasWebsite && websiteAnalysis?.isAccessible) {
    score += 30;
    factors.push('✓ Active website');
    
    if (websiteAnalysis.hasSSL) {
      score += 10;
      factors.push('✓ Secure website (HTTPS)');
    }
  } else if (hasWebsite && !websiteAnalysis?.isAccessible) {
    score += 5;
    factors.push('⚠️ Website URL provided but not accessible');
  } else {
    factors.push('✗ No website');
  }

  // Social media presence (40 points)
  const validSocialLinks = socialAnalysis.filter(s => s.isValid);
  if (validSocialLinks.length >= 3) {
    score += 40;
    factors.push(`✓ Strong social presence (${validSocialLinks.length} platforms)`);
  } else if (validSocialLinks.length === 2) {
    score += 30;
    factors.push(`✓ Moderate social presence (${validSocialLinks.length} platforms)`);
  } else if (validSocialLinks.length === 1) {
    score += 20;
    factors.push(`✓ Basic social presence (${validSocialLinks.length} platform)`);
  } else {
    factors.push('✗ No social media presence');
  }

  // Professional platforms bonus (20 points)
  const hasLinkedIn = validSocialLinks.some(s => s.platform === 'LinkedIn');
  const hasProfessionalPresence = hasLinkedIn && hasWebsite && websiteAnalysis?.hasSSL;
  
  if (hasProfessionalPresence) {
    score += 20;
    factors.push('✓ Professional digital presence (LinkedIn + secure website)');
  } else if (hasLinkedIn) {
    score += 10;
    factors.push('✓ LinkedIn presence');
  }

  return { score, factors };
}

/**
 * Determine digital maturity level
 */
function assessDigitalMaturity(establishmentScore: number): 'Low' | 'Medium' | 'High' {
  if (establishmentScore >= 75) {
    return 'High';
  } else if (establishmentScore >= 40) {
    return 'Medium';
  } else {
    return 'Low';
  }
}

/**
 * Generate recommendations based on web presence
 */
function generateRecommendations(
  hasWebsite: boolean,
  websiteAnalysis: WebPresenceScore['websiteAnalysis'],
  socialAnalysis: WebPresenceScore['socialAnalysis'],
  digitalMaturity: 'Low' | 'Medium' | 'High'
): string[] {
  const recommendations: string[] = [];

  if (!hasWebsite) {
    recommendations.push('🎯 No website - may need education on digital transformation value');
  } else if (websiteAnalysis && !websiteAnalysis.isAccessible) {
    recommendations.push('🎯 Website inaccessible - may indicate technical issues or outdated infrastructure');
  } else if (websiteAnalysis && !websiteAnalysis.hasSSL) {
    recommendations.push('🎯 No HTTPS - security upgrade needed as part of modernization');
  }

  const validSocialLinks = socialAnalysis.filter(s => s.isValid);
  if (validSocialLinks.length === 0) {
    recommendations.push('🎯 No social media - may need support with digital marketing automation');
  } else if (validSocialLinks.length >= 3) {
    recommendations.push('💡 Strong social presence - opportunity for social media automation/management');
  }

  const hasLinkedIn = validSocialLinks.some(s => s.platform === 'LinkedIn');
  if (!hasLinkedIn) {
    recommendations.push('💡 No LinkedIn - B2B lead generation opportunity');
  }

  // Digital maturity insights
  if (digitalMaturity === 'Low') {
    recommendations.push('🎯 Low digital maturity - focus on education and ROI case studies');
    recommendations.push('🎯 May need phased implementation approach starting with quick wins');
  } else if (digitalMaturity === 'Medium') {
    recommendations.push('💡 Moderate digital maturity - ready for intermediate automation solutions');
  } else {
    recommendations.push('💡 High digital maturity - can handle advanced automation and integrations');
    recommendations.push('💡 Likely tech-savvy - can move faster with implementation');
  }

  return recommendations;
}

/**
 * Main function to evaluate web presence
 */
export async function evaluateWebPresence(data: ContactFormData): Promise<WebPresenceScore> {
  const hasWebsite = !!data.website && data.website !== '';
  const hasSocialMedia = !!data.socialLinks && data.socialLinks.length > 0;

  // Analyze website
  let websiteAnalysis: WebPresenceScore['websiteAnalysis'];
  if (hasWebsite && data.website) {
    websiteAnalysis = await analyzeWebsite(data.website);
  }

  // Analyze social media
  const socialAnalysis = analyzeSocialMedia(data.socialLinks);

  // Calculate establishment indicators
  const establishmentIndicators = calculateEstablishmentScore(
    hasWebsite,
    websiteAnalysis,
    socialAnalysis
  );

  // Assess digital maturity
  const digitalMaturity = assessDigitalMaturity(establishmentIndicators.score);

  // Generate recommendations
  const recommendations = generateRecommendations(
    hasWebsite,
    websiteAnalysis,
    socialAnalysis,
    digitalMaturity
  );

  return {
    overallScore: establishmentIndicators.score,
    hasWebsite,
    hasSocialMedia,
    websiteAnalysis,
    socialAnalysis,
    establishmentIndicators,
    digitalMaturity,
    recommendations,
  };
}

/**
 * Format web presence analysis for email
 */
export function formatWebPresenceForEmail(webPresence: WebPresenceScore): string {
  return `
WEB PRESENCE ANALYSIS (${webPresence.overallScore}/100)
Digital Maturity: ${webPresence.digitalMaturity}

${webPresence.hasWebsite ? `
Website Analysis:
  URL: ${webPresence.websiteAnalysis ? 'Provided' : 'N/A'}
  Status: ${webPresence.websiteAnalysis?.isAccessible ? '✓ Accessible' : '✗ Not accessible'}
  Security: ${webPresence.websiteAnalysis?.hasSSL ? '✓ HTTPS' : '✗ No HTTPS'}
  ${webPresence.websiteAnalysis?.error ? `  Error: ${webPresence.websiteAnalysis.error}` : ''}
` : 'No website provided'}

${webPresence.hasSocialMedia ? `
Social Media Presence:
${webPresence.socialAnalysis.map(s => `  • ${s.platform}: ${s.isValid ? '✓' : '✗'} ${s.url}`).join('\n')}
` : 'No social media links provided'}

Establishment Indicators:
${webPresence.establishmentIndicators.factors.map(f => `  ${f}`).join('\n')}

${webPresence.recommendations.length > 0 ? `
Recommendations:
${webPresence.recommendations.map(r => `  ${r}`).join('\n')}
` : ''}
`;
}

