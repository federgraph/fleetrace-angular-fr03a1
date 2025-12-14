import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

export class BreakpointSet {
  XSmall = false;
  Small = false;
  Medium = false;
  Large = false;
  XLarge = false;
  Handset = false;
  Tablet = false;
  Web = false;
  HandsetPortrait = false;
  TabletPortrait = false;
  WebPortrait = false;
  HandsetLandscape = false;
  TabletLandscape = false;
  WebLandscape = false;

  clear() {
    this.XSmall = false;
    this.Small = false;
    this.Medium = false;
    this.Large = false;
    this.XLarge = false;
    this.Handset = false;
    this.Tablet = false;
    this.Web = false;
    this.HandsetPortrait = false;
    this.TabletPortrait = false;
    this.WebPortrait = false;
    this.HandsetLandscape = false;
    this.TabletLandscape = false;
    this.WebLandscape = false;
  }

  test(o: BreakpointObserver) {
    this.XSmall = o.isMatched(Breakpoints.XSmall);
    this.Small = o.isMatched(Breakpoints.Small);
    this.Medium = o.isMatched(Breakpoints.Medium);
    this.Large = o.isMatched(Breakpoints.Large);
    this.XLarge = o.isMatched(Breakpoints.XLarge);

    this.Handset = o.isMatched(Breakpoints.Handset);
    this.Tablet = o.isMatched(Breakpoints.Tablet);
    this.Web = o.isMatched(Breakpoints.Web);

    this.HandsetPortrait = o.isMatched(Breakpoints.HandsetPortrait);
    this.TabletPortrait = o.isMatched(Breakpoints.TabletPortrait);
    this.WebPortrait = o.isMatched(Breakpoints.WebPortrait);

    this.HandsetLandscape = o.isMatched(Breakpoints.HandsetLandscape);
    this.TabletLandscape = o.isMatched(Breakpoints.TabletLandscape);
    this.WebLandscape = o.isMatched(Breakpoints.WebLandscape);
  }

  all(): string[] {
    const result = [
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge,

      Breakpoints.Handset,
      Breakpoints.Tablet,
      Breakpoints.Web,

      Breakpoints.HandsetPortrait,
      Breakpoints.TabletPortrait,
      Breakpoints.WebPortrait,

      Breakpoints.HandsetLandscape,
      Breakpoints.TabletLandscape,
      Breakpoints.WebLandscape,
    ];
    return result;
  }

  get id(): string {
    if (this.XSmall) {
      return 'xs';
    } else if (this.Small) {
      return 'sm';
    } else if (this.Medium) {
      return 'md';
    } else if (this.Large) {
      return 'lg';
    } else if (this.XLarge) {
      return 'xl';
    } else {
      return 'md';
    }
  }
}
