// Screen reader testing and optimization utilities

export interface ScreenReaderTest {
  id: string;
  name: string;
  description: string;
  element: HTMLElement;
  expectedAnnouncement: string;
  actualAnnouncement?: string;
  passed: boolean;
  suggestions: string[];
}

export interface ScreenReaderReport {
  timestamp: Date;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  successRate: number;
  tests: ScreenReaderTest[];
  recommendations: string[];
}

export interface AriaLiveRegion {
  element: HTMLElement;
  politeness: 'polite' | 'assertive' | 'off';
  atomic: boolean;
  relevant: string;
  busy: boolean;
}

// Screen reader testing utilities
export class ScreenReaderTester {
  private static instance: ScreenReaderTester;
  private tests: ScreenReaderTest[] = [];
  private liveRegions: AriaLiveRegion[] = [];
  private announcements: string[] = [];

  static getInstance(): ScreenReaderTester {
    if (!ScreenReaderTester.instance) {
      ScreenReaderTester.instance = new ScreenReaderTester();
    }
    return ScreenReaderTester.instance;
  }

  // Run comprehensive screen reader tests
  async runScreenReaderTests(element: HTMLElement = document.body): Promise<ScreenReaderReport> {
    this.tests = [];
    this.announcements = [];

    console.log('🔊 Starting screen reader tests...');

    // Test different types of elements
    await this.testHeadings(element);
    await this.testLinks(element);
    await this.testButtons(element);
    await this.testFormControls(element);
    await this.testImages(element);
    await this.testLandmarks(element);
    await this.testLiveRegions(element);
    await this.testTables(element);
    await this.testLists(element);
    await this.testAriaAttributes(element);

    return this.generateReport();
  }

  // Test heading announcements
  private async testHeadings(element: HTMLElement): Promise<void> {
    const headings = element.querySelectorAll('h1, h2, h3, h4, h5, h6');

    headings.forEach((heading, index) => {
      const level = heading.tagName.charAt(1);
      const text = heading.textContent?.trim() || '';
      const ariaLabel = heading.getAttribute('aria-label');
      const ariaLabelledby = heading.getAttribute('aria-labelledby');

      let expectedAnnouncement = '';
      let actualAnnouncement = '';

      if (ariaLabel) {
        expectedAnnouncement = `${ariaLabel}, heading level ${level}`;
        actualAnnouncement = this.simulateScreenReaderAnnouncement(heading);
      } else if (ariaLabelledby) {
        const referencedElement = document.getElementById(ariaLabelledby);
        const referencedText = referencedElement?.textContent?.trim() || '';
        expectedAnnouncement = `${referencedText}, heading level ${level}`;
        actualAnnouncement = this.simulateScreenReaderAnnouncement(heading);
      } else {
        expectedAnnouncement = `${text}, heading level ${level}`;
        actualAnnouncement = this.simulateScreenReaderAnnouncement(heading);
      }

      const passed = this.compareAnnouncements(expectedAnnouncement, actualAnnouncement);

      this.tests.push({
        id: `heading-${index}`,
        name: `Heading Level ${level}`,
        description: `Test heading announcement for "${text.substring(0, 50)}..."`,
        element: heading as HTMLElement,
        expectedAnnouncement,
        actualAnnouncement,
        passed,
        suggestions: passed ? [] : [
          'Ensure heading has accessible text',
          'Check aria-label or aria-labelledby',
          'Verify heading level is appropriate'
        ]
      });
    });
  }

  // Test link announcements
  private async testLinks(element: HTMLElement): Promise<void> {
    const links = element.querySelectorAll('a[href]');

    links.forEach((link, index) => {
      const text = link.textContent?.trim() || '';
      const ariaLabel = link.getAttribute('aria-label');
      const title = link.getAttribute('title');
      const href = link.getAttribute('href');
      const isExternal = href?.startsWith('http') && !href.includes(window.location.hostname);

      let expectedAnnouncement = '';
      
      if (ariaLabel) {
        expectedAnnouncement = `${ariaLabel}, link`;
      } else if (text) {
        expectedAnnouncement = `${text}, link`;
      } else if (title) {
        expectedAnnouncement = `${title}, link`;
      } else {
        expectedAnnouncement = `${href}, link`;
      }

      if (isExternal) {
        expectedAnnouncement += ', external';
      }

      if (link.getAttribute('target') === '_blank') {
        expectedAnnouncement += ', opens in new window';
      }

      const actualAnnouncement = this.simulateScreenReaderAnnouncement(link);
      const passed = this.compareAnnouncements(expectedAnnouncement, actualAnnouncement);

      this.tests.push({
        id: `link-${index}`,
        name: `Link`,
        description: `Test link announcement for "${text.substring(0, 50)}..."`,
        element: link as HTMLElement,
        expectedAnnouncement,
        actualAnnouncement,
        passed,
        suggestions: passed ? [] : [
          'Add descriptive link text',
          'Use aria-label for context',
          'Indicate external links',
          'Warn about new windows'
        ]
      });
    });
  }

  // Test button announcements
  private async testButtons(element: HTMLElement): Promise<void> {
    const buttons = element.querySelectorAll('button, input[type="button"], input[type="submit"], input[type="reset"]');

    buttons.forEach((button, index) => {
      const text = button.textContent?.trim() || '';
      const ariaLabel = button.getAttribute('aria-label');
      const value = button.getAttribute('value');
      const type = button.getAttribute('type');
      const disabled = button.hasAttribute('disabled');
      const ariaPressed = button.getAttribute('aria-pressed');
      const ariaExpanded = button.getAttribute('aria-expanded');

      let expectedAnnouncement = '';

      if (ariaLabel) {
        expectedAnnouncement = ariaLabel;
      } else if (text) {
        expectedAnnouncement = text;
      } else if (value) {
        expectedAnnouncement = value;
      }

      expectedAnnouncement += ', button';

      if (type === 'submit') {
        expectedAnnouncement += ', submit';
      }

      if (disabled) {
        expectedAnnouncement += ', disabled';
      }

      if (ariaPressed === 'true') {
        expectedAnnouncement += ', pressed';
      } else if (ariaPressed === 'false') {
        expectedAnnouncement += ', not pressed';
      }

      if (ariaExpanded === 'true') {
        expectedAnnouncement += ', expanded';
      } else if (ariaExpa