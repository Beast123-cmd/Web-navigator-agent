# app/agents/navigator_agent.py
import asyncio
from playwright.async_api import async_playwright, Page, Browser, TimeoutError
import logging
from typing import Optional, Callable

logger = logging.getLogger(__name__)

async def _auto_scroll(page: Page, scroll_delay: float = 0.15, max_scrolls: int = 30):
    # scroll down to trigger lazy loads
    for _ in range(max_scrolls):
        await page.evaluate("window.scrollBy(0, window.innerHeight)")
        await asyncio.sleep(scroll_delay)

class NavigatorAgent:
    def __init__(self, headless: bool = True, slow_mo: int = 0, user_agent: Optional[str] = None):
        self.headless = headless
        self.slow_mo = slow_mo
        self.user_agent = user_agent
        self._playwright = None
        self._browser: Optional[Browser] = None

    async def __aenter__(self):
        self._playwright = await async_playwright().start()
        self._browser = await self._playwright.chromium.launch(headless=self.headless, args=["--no-sandbox"], slow_mo=self.slow_mo)
        return self

    async def __aexit__(self, exc_type, exc, tb):
        if self._browser:
            await self._browser.close()
        if self._playwright:
            await self._playwright.stop()

    async def fetch_listing_html(self, url: str, wait_for_selector: Optional[str] = None, timeout: int = 30000) -> str:
        """Open page, wait for selector (if provided), auto-scroll and return HTML content."""
        context = await self._browser.new_context(user_agent=self.user_agent)
        page = await context.new_page()
        try:
            await page.goto(url, wait_until="domcontentloaded", timeout=timeout)
            # small random sleep to mimic human behavior
            await asyncio.sleep(0.6)
            if wait_for_selector:
                try:
                    await page.wait_for_selector(wait_for_selector, timeout=12000)
                except TimeoutError:
                    logger.debug("wait_for_selector timed out: %s", wait_for_selector)
            # auto scroll to load lazy items
            await _auto_scroll(page)
            await asyncio.sleep(0.6)
            html = await page.content()
            return html
        finally:
            try:
                await page.close()
            except:
                pass
            await context.close()
