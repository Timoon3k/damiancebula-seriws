</main>
<footer class="site-footer">
<div class="footer-cta wrap" id="kontakt"><a class="big-phone" href="tel:+48794225139"><?php echo dc_icon('phone'); ?>794 225 139</a><p>Zgłoś serwis lub zapytaj o ofertę.<br>Doradzimy i umówimy dogodny termin.</p><a class="button" href="<?php echo esc_url(home_url('/kontakt/')); ?>">Skontaktuj się <?php echo dc_icon(); ?></a></div>
<div class="footer-bottom wrap"><address class="footer-business-address"><?php echo esc_html(dc_company_address()); ?></address><p>© <?php echo esc_html(wp_date('Y')); ?> Damian Cebula · Stalowa Wola i okolice</p><a href="mailto:kontakt@damiancebula-serwis.pl">kontakt@damiancebula-serwis.pl</a><a href="<?php echo esc_url(get_privacy_policy_url() ?: home_url('/polityka-prywatnosci/')); ?>">Polityka prywatności</a><p class="site-credit">Projekt i wykonanie: <a href="https://majewskitomasz.pl/" rel="author">majewskitomasz.pl</a></p></div>
</footer>
<dialog class="lightbox" aria-label="Podgląd realizacji"><button type="button" class="lightbox-close" aria-label="Zamknij podgląd">Zamknij ×</button><img alt=""><p></p></dialog>
<?php wp_footer(); ?></body></html>
