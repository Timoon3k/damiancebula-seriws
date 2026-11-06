<!doctype html>
<html class="no-js" <?php language_attributes(); ?>>
<head><script>document.documentElement.classList.replace("no-js","js");</script><meta charset="<?php bloginfo('charset'); ?>"><meta name="viewport" content="width=device-width, initial-scale=1"><?php wp_head(); ?></head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<a class="skip-link" href="#main">Przejdź do treści</a>
<header class="site-header"><div class="header-inner">
<a class="brand" href="<?php echo esc_url(home_url('/')); ?>" aria-label="Damian Cebula — strona główna"><?php dc_header_brand(); ?></a>
<button class="menu-toggle" type="button" aria-expanded="false" aria-controls="dc-mobile-menu" aria-haspopup="dialog">Menu <span aria-hidden="true">☰</span></button>
<nav id="primary-nav" aria-label="Główna"><?php if (has_nav_menu('primary')) { wp_nav_menu(['theme_location'=>'primary','container'=>false,'menu_class'=>'menu']); } else { dc_menu(); } ?></nav>
<a class="header-phone" href="tel:+48794225139"><?php echo dc_icon('phone'); ?> <span>794 225 139</span></a>
</div></header>
<dialog class="mobile-menu" id="dc-mobile-menu" aria-labelledby="dc-mobile-menu-title">
<div class="mobile-menu-head"><p id="dc-mobile-menu-title">Menu</p><button class="mobile-menu-close" type="button" aria-label="Zamknij menu"><span aria-hidden="true">×</span></button></div>
<div class="mobile-menu-nav"></div>
<div class="mobile-menu-contact"><p>Damian Cebula<span>Serwis Klimatyzacji i AGD</span></p><a href="tel:+48794225139"><?php echo dc_icon('phone'); ?>794 225 139</a></div>
</dialog>
<main id="main" tabindex="-1">
