<?php
/**
 * Template Name: DC — układ projektowy (nagłówek w treści)
 * Template Post Type: page
 */
get_header(); ?>
<div class="wrap breadcrumb"><a href="<?php echo esc_url(home_url('/')); ?>">Strona główna</a><span aria-hidden="true"> / </span><span><?php the_title(); ?></span></div>
<?php while (have_posts()) : the_post(); the_content(); endwhile; get_footer(); ?>
