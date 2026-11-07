</main>
<footer class="site-footer">
<div class="footer-cta wrap" id="kontakt">
    <div class="footer-cta-lead"><p class="footer-eyebrow">Serwis klimatyzacji i AGD</p><a class="big-phone" href="tel:+48794225139"><?php echo dc_icon('phone'); ?>794 225 139</a></div>
    <p class="footer-invitation">Zgłoś serwis lub zapytaj o ofertę.<br>Doradzimy i umówimy dogodny termin.</p>
    <a class="button" href="<?php echo esc_url(home_url('/kontakt/')); ?>">Skontaktuj się <?php echo dc_icon(); ?></a>
</div>
<div class="footer-directory wrap">
    <p class="footer-signature"><strong>Damian Cebula</strong><span>Stalowa Wola i okolice</span></p>
    <nav aria-label="Nawigacja w stopce"><ul class="footer-menu"><?php foreach (dc_links() as $slug=>$label) : ?><li><a href="<?php echo esc_url(home_url('/'.($slug ? $slug.'/' : ''))); ?>"><?php echo esc_html($label); ?></a></li><?php endforeach; ?></ul></nav>
</div>
<div class="footer-bottom wrap">
    <p>© <?php echo esc_html(wp_date('Y')); ?> Damian Cebula</p>
    <a href="<?php echo esc_url(get_privacy_policy_url() ?: home_url('/polityka-prywatnosci/')); ?>">Polityka prywatności</a>
    <p class="site-credit">Projekt i wykonanie: <a href="https://majewskitomasz.pl/" rel="author">majewskitomasz.pl</a></p>
</div>
</footer>
<dialog class="lightbox" aria-label="Podgląd realizacji"><button type="button" class="lightbox-close" aria-label="Zamknij podgląd">Zamknij ×</button><img alt=""><p></p></dialog>
<?php wp_footer(); ?></body></html>
