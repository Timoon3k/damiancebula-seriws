<?php get_header(); ?>
<div class="wrap breadcrumb"><a href="<?php echo esc_url(home_url('/')); ?>">Strona główna</a><span aria-hidden="true"> / </span><span><?php the_title(); ?></span></div>
<?php while (have_posts()) : the_post(); ?>
<?php if (get_post_meta(get_the_ID(), '_dc_layout', true) !== 'designed') : ?><article class="wrap prose"><h1><?php the_title(); ?></h1><?php the_content(); ?></article><?php else : the_content(); endif; ?>
<?php endwhile; get_footer(); ?>
