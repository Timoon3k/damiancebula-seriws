<!doctype html>
<html class="no-js" <?php language_attributes(); ?>>
<head><script>document.documentElement.classList.replace("no-js","js");</script><meta charset="<?php bloginfo('charset'); ?>"><meta name="viewport" content="width=device-width, initial-scale=1"><?php wp_head(); ?></head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<a class="skip-link" href="#main">Przejdź do treści</a>
<header class="site-header"><div class="header-inner">
<a class="brand" href="<?php echo esc_url(home_url('/')); ?>" aria-label="Damian Cebula — strona główna"><?php dc_header_brand(); ?></a>
<button class="menu-toggle" aria-expanded="false" aria-controls="primary-nav">Menu <span aria-hidden="true">☰</span></button>
<nav id="primary-nav" aria-label="Główna"><?php if (has_nav_menu('primary')) { wp_nav_menu(['theme_location'=>'primary','container'=>false,'menu_class'=>'menu']); } else { dc_menu(); } ?></nav>
<a class="header-phone" href="tel:+48794225139"><?php echo dc_icon('phone'); ?> <span>794 225 139</span></a>
</div></header>
<main id="main" tabindex="-1">
